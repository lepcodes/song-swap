import requests
import urllib.parse
import uuid
import base64
import supabase
import re
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

os.environ['SUPABASE_KEY']
supabase = supabase.create_client(
    supabase_url=os.environ['SUPABASE_URL'],
    supabase_key=os.environ['SUPABASE_KEY']
)
CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
REDIRECT_URI = os.environ['BACKEND_URL']
WEB_URL = os.environ['FRONTEND_URL']

TOKEN_URL = 'https://accounts.spotify.com/api/token'
AUTH_URL = 'https://accounts.spotify.com/authorize?'
SCOPE = 'playlist-read-private'
AUTH_PARAMS = {
    'client_id': CLIENT_ID,
    'response_type': 'code',
    'redirect_uri': REDIRECT_URI,
    'scope': SCOPE
}

SCOPE = 'playlist-read-private'
TOKEN_HEADERS = {
    'Authorization': 'Basic ' +
    base64.b64encode((CLIENT_ID + ':' + CLIENT_SECRET).encode()).decode(),
    'Content-Type': 'application/x-www-form-urlencoded'
}
PLAYLIST_URL_ENDPOINT = 'https://api.spotify.com/v1/playlists/'

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[WEB_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_relevant_data(playlist):
    tracks = []
    playlist_duration = 0
    for track in playlist['tracks']['items']:
        try:
            tracks.append({
                'id': track['track']['id'],
                'name': track['track']['name'],
                'cover': track['track']['album']['images'][2]['url'],
                'artist': track['track']['artists'][0]['name']
            })
            playlist_duration += track['track']['duration_ms']
        except Exception as e:
            print(e)
            print('Error Track')
            print(track)

    return {
        'id': playlist['id'],
        'name': playlist['name'],
        'owner': playlist['owner']['display_name'],
        'cover': playlist['images'][0]['url'],
        'tracks': tracks,
        'duration': playlist_duration
    }


def get_valid_token(user_id):
    # TODO: Error Handling and Take into account Expiration
    response = supabase.table('song-swap-db').select('access_token').eq('user_id', user_id).execute()
    token = response.data[0]['access_token']
    response = supabase.table('song-swap-db').select('expires_in').eq('user_id', user_id).execute()
    expire_at = response.data[0]['expires_in']
    if token:
        print(expire_at)
        print(datetime.now())
        if datetime.now() > datetime.fromisoformat(expire_at):
            print('Expired Token, Refreshing...')
            token = refresh_token(user_id)
        return token


def refresh_token(user_id):
    response = supabase.table('song-swap-db').select('refresh_token').eq('user_id', user_id).execute()
    ref_token = response.data[0]['refresh_token']
    response = requests.post(
        url=TOKEN_URL,
        headers=TOKEN_HEADERS,
        data={
            'grant_type': 'refresh_token',
            'refresh_token': ref_token,
            'client_id': CLIENT_ID
        }
    )
    if response.status_code != 200:
        # TODO: Error Handling
        print(response.reason)
        return

    token_data = response.json()
    supabase.table('song-swap-db').update(
        {'access_token': token_data['access_token'],
         'expires_in': (datetime.now() +
                        timedelta(seconds=token_data['expires_in'])).isoformat()}
    ).eq('user_id', user_id).execute()

    return token_data['access_token']


@app.get("/")
async def root():
    return {"Hello World!"}


@app.get("/oauth")
async def oauth(request: Request, response: Response):

    user_id = request.cookies.get('user_id')

    if user_id:
        # TODO: Error Handling
        query = supabase.table('song-swap-db').select('*').eq('user_id', user_id).execute()
        user = query.data[0]
        if user:
            return JSONResponse({"status": "success", "message": "User Logged in", "data": ''})

    # If Not Previous User Respond with Auth URL
    new_user_id = str(uuid.uuid4())

    # Create placeholder user in database
    supabase.table('song-swap-db').insert(
        {
            'user_id': new_user_id,
            'access_token': '',
            'refresh_token': '',
            'expires_in': None,
            'auth_status': 'logging'  # Initial status
        }
    ).execute()

    # Redirect to OAuth URL and set the user_id cookie
    response = JSONResponse({"status": "success", "data":
                            {"oauth_url": AUTH_URL + urllib.parse.urlencode(AUTH_PARAMS)}})
    response.set_cookie(
        key="user_id",
        value=new_user_id,
        max_age=int(timedelta(days=30).total_seconds()),  # Expires in 1 month
        httponly=True,  # Prevent JavaScript access
        secure=False,    # Allow cookies over HTTP (for local testing)
        samesite="lax"   # Prevent CSRF attacks
    )
    return response


@app.get("/callback")
async def callback(request: Request):
    code = request.query_params.get('code')
    user_id = request.cookies.get('user_id')
    if not code:
        return JSONResponse({"status": "error", "message": "Code Not Found"})

    if not user_id:
        return JSONResponse({"status": "error", "message": "User Not Found in Cookie"})

    response = requests.post(
        url=TOKEN_URL,
        headers=TOKEN_HEADERS,
        data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI
        }
    )
    if response.status_code != 200:
        print('Failed to exchange code for tokens')
        supabase.table('song-swap-db').update(
            {'auth_status': 'error'}
        ).eq('user_id', user_id).execute()
        return JSONResponse({"status": "error", "message": "Failed to exchange code for tokens"})

    token_data = response.json()
    print('Logged in')
    supabase.table('song-swap-db').update(
        {'access_token': token_data['access_token'],
         'refresh_token': token_data['refresh_token'],
         'expires_in': (datetime.now() + timedelta(seconds=token_data['expires_in'])).isoformat(),
         'auth_status': 'logged'}
    ).eq('user_id', user_id).execute()

    # Redirect to home page of web app
    return RedirectResponse(url=WEB_URL)


@app.get("/oauth-status")
async def oauth_status(request: Request):
    user_id = request.cookies.get('user_id')
    try:
        response = supabase.table('song-swap-db').select('auth_status').eq('user_id', user_id).execute()
        status = response.data[0]['auth_status']
        return JSONResponse({"status": status})
    except Exception as e:
        print(e)
        return JSONResponse({"status": 'error'})


@app.get("/playlist")
async def playlist(request: Request):
    user_id = request.cookies.get('user_id')
    if not user_id:
        return JSONResponse({"status": "error", "message": "User Not Found in Cookie"})

    playlist_url = request.query_params.get('url')
    match = re.search(r'playlist\/([a-zA-Z0-9]+)', playlist_url)
    if not match:
        return JSONResponse({"status": "error", "message": "Playlist ID Not Found"})

    playlist_id = match.group(1)
    token = get_valid_token(user_id)
    response = requests.get(PLAYLIST_URL_ENDPOINT+playlist_id,
                            headers={'Authorization': 'Bearer ' + token})
    if response.status_code != 200:
        return JSONResponse({"status": "error", "message": "Failed to fetch playlist"})

    return JSONResponse({"status": "success", "data": extract_relevant_data(response.json())})


@app.get("/account-playlists")
async def account_playlists(request: Request):
    user_id = request.cookies.get('user_id')
    token = get_valid_token(user_id)
    if not user_id:
        return JSONResponse({"status": "error", "message": "User Not Found in Cookie"})

    response = requests.get("https://api.spotify.com/v1/me/playlists",
                            headers={'Authorization': 'Bearer ' + token})
    if response.status_code != 200:
        return JSONResponse({"status": "error", "message": "Failed to fetch playlists"})

    playlists = []
    for playlist in response.json()['items']:
        response = requests.get(playlist['href'],
                                headers={'Authorization': 'Bearer ' + token})
        playlists.append(extract_relevant_data(response.json()))
    return JSONResponse({"status": "success", "data": playlists})
