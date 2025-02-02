import requests
import urllib.parse
import uuid
import base64
# Change sqlite3 to supabase
import supabase
import re
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

# STATE = ''
CLIENT_ID = 'd2c681f1824c46c88e15e47e794e9037'
CLIENT_SECRET = 'd5ed08c6a32942a69b1cf29d49dc2207'
AUTH_URL = 'https://accounts.spotify.com/authorize?'
REDIRECT_URI = 'http://localhost:8000/callback'
SCOPE = 'playlist-read-private'
AUTH_PARAMS = {
    'client_id': CLIENT_ID,
    'response_type': 'code',
    'redirect_uri': REDIRECT_URI,
    'scope': SCOPE
}

TOKEN_PATH = 'token.json'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
SCOPE = 'playlist-read-private'
TOKEN_HEADERS = {
    'Authorization': 'Basic ' +
    base64.b64encode((CLIENT_ID + ':' + CLIENT_SECRET).encode()).decode(),
    'Content-Type': 'application/x-www-form-urlencoded'
}

WEB_URL = 'http://localhost:5173'
PLAYLIST_URL_ENDPOINT = 'https://api.spotify.com/v1/playlists/'


app = FastAPI()

supabase = supabase.create_client(
    supabase_url='https://petsvjivlodaiiqepasv.supabase.co',
    supabase_key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldHN2aml2bG9kYWlpcWVwYXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQ3NDI2NCwiZXhwIjoyMDU0MDUwMjY0fQ.m8uhx5ucw_OKM7SttbGFkYc-Y5XgOfqBkba7fRoF-hY'
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[WEB_URL],  # Your React app's URL
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

    return


def get_valid_token(user_id):
    # TODO: Error Handling and Take into account Expiration
    response = supabase.table('song-swap-db').select('access_token').eq('user_id', user_id).execute()
    token = response.data[0]['access_token']
    response = supabase.table('song-swap-db').select('expires_in').eq('user_id', user_id).execute()
    expired = response.data[0]['expires_in']
    if token:
        print(expired)
        print(datetime.now())
        if datetime.now() > datetime.fromisoformat(expired):
            print('Expired')
            refresh_token(user_id)
        return token


@app.get("/")
async def root():
    return {"Hello World!"}


@app.get("/oauth")
async def oauth(request: Request, response: Response):

    user_id = request.cookies.get('user_id')

    if user_id:
        # TODO: Error Handling
        response = supabase.table('song-swap-db').select('*').eq('user_id', user_id).execute()
        user = response.data[0]
        if user:
            return JSONResponse({"status": "success", "data": ""})
        else:
            return JSONResponse({"status": "error", "message": "User Not Found in Database"})

    else:
        # If Not Previous User Respond with Auth URL
        # Create new user
        new_user_id = str(uuid.uuid4())
        supabase.table('song-swap-db').insert(
            {'user_id': new_user_id,
             'access_token': '',
             'refresh_token': '',
             'expires_in': None,
             'auth_status': 'logging'}
        ).execute()

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
    if code:
        response = requests.post(
            url=TOKEN_URL,
            headers=TOKEN_HEADERS,
            data={
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': REDIRECT_URI
            }
        )
        if response.status_code == 200:
            token_data = response.json()
            supabase.table('song-swap-db').update(
                {'access_token': token_data['access_token'],
                 'refresh_token': token_data['refresh_token'],
                 'expires_in': (datetime.now() + timedelta(seconds=token_data['expires_in'])).isoformat(),
                 'auth_status': 'logged'}
            ).eq('user_id', user_id).execute()
            # redirect to home page of web app
            return RedirectResponse(url='http://localhost:5173')
        return {'status': 'error', 'message': 'Code Not Found'}
    return {'status': 'error', 'message': 'User Not Found'}


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
    if user_id:
        playlist_url = request.query_params.get('url')
        match = re.search(r'playlist\/([a-zA-Z0-9]+)', playlist_url)
        if match:
            playlist_id = match.group(1)
            token = get_valid_token(user_id)
            response = requests.get(PLAYLIST_URL_ENDPOINT+playlist_id,
                                    headers={'Authorization': 'Bearer ' + token})
            print(PLAYLIST_URL_ENDPOINT+playlist_id)
            if response.status_code == 200:
                return JSONResponse({"status": "success", "data": extract_relevant_data(response.json())})
        else:
            return JSONResponse({"status": "error", "message": "Playlist ID Not Found"})
    else:
        return JSONResponse({"status": "error", "message": "User Not Found"})


@app.get("/account-playlists")
async def account_playlists(request: Request):
    user_id = request.cookies.get('user_id')
    token = get_valid_token(user_id)
    if user_id:
        response = requests.get("https://api.spotify.com/v1/me/playlists",
                                headers={'Authorization': 'Bearer ' + token})
        print(response.status_code)
        playlists = []
        for playlist in response.json()['items']:
            print(playlist['name'])
            response = requests.get(playlist['href'],
                                    headers={'Authorization': 'Bearer ' + token})
            playlists.append(extract_relevant_data(response.json()))
        return JSONResponse({"status": "success", "data": playlists})
    else:
        return JSONResponse({"status": "error", "message": "User Not Found"})
