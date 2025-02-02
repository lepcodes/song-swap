import requests
import urllib.parse
import uuid
import base64
import sqlite3
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

con = sqlite3.connect('song-swap.db')
cur = con.cursor()
cur.execute('''CREATE TABLE IF NOT EXISTS
            users(user_id TEXT PRIMARY KEY,
            access_token TEXT,
            refresh_token TEXT,
            expires_in TEXT,
            auth_status TEXT)''')

con.commit()

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
    ref_token = cur.execute("SELECT refresh_token FROM users WHERE user_id = ?", (user_id,)).fetchone()
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
    cur.execute('''UPDATE users SET
                access_token = ?,
                expires_in = ?
                WHERE user_id = ?''',
                (token_data['access_token'],
                    (datetime.now() +
                        timedelta(seconds=token_data['expires_in'])).isoformat(),
                    user_id,))
    con.commit()


def get_valid_token(user_id):
    # TODO: Error Handling and Take into account Expiration
    token = cur.execute("SELECT access_token FROM users WHERE user_id = ?", (user_id,)).fetchone()
    expired = cur.execute("SELECT expires_in FROM users WHERE user_id = ?", (user_id,)).fetchone()
    if token:
        print(expired[0])
        print(datetime.now())
        if datetime.now() > datetime.fromisoformat(expired[0]):
            print('Expired')
            refresh_token(user_id)
        return token[0]


@app.get("/")
async def root():
    return {"Hello World!"}


@app.get("/oauth")
async def oauth(request: Request, response: Response):

    user_id = request.cookies.get('user_id')

    if user_id:
        # TODO: Error Handling
        user = cur.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)).fetchone()
        if user:
            return JSONResponse({"status": "success", "data": ""})
        else:
            return JSONResponse({"status": "error", "message": "User Not Found in Database"})

    else:
        # If Not Previous User Respond with Auth URL
        new_user_id = str(uuid.uuid4())
        cur.execute('''INSERT INTO users
                    (user_id,
                    access_token,
                    refresh_token,
                    expires_in,
                    auth_status)
                    VALUES (?, '', '', '', 'logging')''',
                    (new_user_id,))
        con.commit()
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
            cur.execute('''UPDATE users
                        SET
                        access_token = ?,
                        refresh_token = ?,
                        expires_in = ?,
                        auth_status = 'logged'
                        WHERE user_id = ?''',
                        (token_data['access_token'],
                            token_data['refresh_token'],
                            (datetime.now() + timedelta(seconds=token_data['expires_in'])).isoformat(),
                            user_id,))
            con.commit()
            # redirect to home page of web app
            return RedirectResponse(url='http://localhost:5173')
        return {'status': 'error', 'message': 'Code Not Found'}
    return {'status': 'error', 'message': 'User Not Found'}


@app.get("/oauth-status")
async def oauth_status(request: Request):
    user_id = request.cookies.get('user_id')
    try:
        status = cur.execute('''SELECT auth_status FROM users WHERE user_id = ?''', (user_id,)).fetchone()
        return JSONResponse({"status": status[0]})
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

        playlists = []
        for playlist in response.json()['items']:
            print(playlist['name'])
            response = requests.get(playlist['href'],
                                    headers={'Authorization': 'Bearer ' + token})
            playlists.append(extract_relevant_data(response.json()))
        return JSONResponse({"status": "success", "data": playlists})
    else:
        return JSONResponse({"status": "error", "message": "User Not Found"})
