import requests
import urllib.parse
import base64
import json
import os
import re
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

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
    'Authorization': 'Basic ' + base64.b64encode((CLIENT_ID + ':' + CLIENT_SECRET).encode()).decode(), 
    'Content-Type': 'application/x-www-form-urlencoded'
}

WEB_URL = 'http://localhost:5173'
PLAYLIST_URL_ENDPOINT = 'https://api.spotify.com/v1/playlists/'


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[WEB_URL],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def set_auth_status(status):
    print(status)
    with open('status.json', 'w') as file:
        json.dump({'status': status}, file)

def get_auth_status():
    with open('status.json', 'r') as file:
        return json.load(file)

def isAuthenticated():
    if not os.path.exists(TOKEN_PATH) or os.stat(TOKEN_PATH).st_size == 0:
        return False
    with open(TOKEN_PATH, 'r') as token_file:
        try:
            token_data = json.load(token_file)
            if 'access_token' in token_data:
                return True
        except json.JSONDecodeError:
            return False
    return False

@app.get("/")
async def root():
    return {"Hello World!"}

@app.get("/oauth")
async def oauth():
    if isAuthenticated():
        # If Authenticated Refresh Token
        with open(TOKEN_PATH, 'r') as token_file:
            token_json = json.load(token_file)

        response = requests.post(
            url = TOKEN_URL,
            headers = TOKEN_HEADERS,
            data = {
                'grant_type': 'refresh_token',
                'refresh_token': token_json['refresh_token'], 
                'client_id': CLIENT_ID
            }
        )

        if response.status_code != 200:
            set_auth_status('error')
            return JSONResponse({"status": "error", "message": response.reason})

        token_data = response.json()
        with open("token.json", "r") as json_file:
            json_dict = json.load(json_file)
        json_dict['access_token'] = token_data['access_token']
        with open("token.json", 'w') as json_file:
            json.dump(json_dict, json_file, indent=4)
        
        set_auth_status('logged')
        return JSONResponse({"status": "success", "data": ""})

    else:
        # If Not Authenticated Respond with Auth URL 
        set_auth_status('logging')
        return JSONResponse({"status": "success", "data": {"oauth_url": AUTH_URL + urllib.parse.urlencode(AUTH_PARAMS)}})

@app.get("/callback")
async def callback(request: Request):
    code = request.query_params.get('code') 
    if code:
        response = requests.post(
            url = TOKEN_URL,
            headers= TOKEN_HEADERS,
            data = {
                'grant_type': 'authorization_code',
                'code': code, 
                'redirect_uri': REDIRECT_URI
            }
        )
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data['access_token']
            refresh_token = token_data['refresh_token']
            with open("token.json", "w") as json_file:
                json.dump({
                    'access_token':access_token, 
                    'refresh_token':refresh_token
                }, json_file, indent=4)
            set_auth_status('logged')
            return {}

    set_auth_status('error')
    return {}

@app.get("/oauth-status")
async def status(request: Request):
    try:
        status = get_auth_status()
        return JSONResponse(status)
    except Exception as e:
        return JSONResponse({"status": 'error'})
    
@app.get("/playlist")
async def status(request: Request):
    playlist_url = request.query_params.get('url')
    match = re.search(r'playlist\/([a-zA-Z0-9]+)',playlist_url)
    if match: 
        playlist_id = match.group(1) 
        with open(TOKEN_PATH, 'r') as token_file:
            token_json = json.load(token_file)
        token = token_json['access_token']
        response = requests.get(PLAYLIST_URL_ENDPOINT+playlist_id,
                                headers={ 'Authorization': 'Bearer ' + token })
        print(PLAYLIST_URL_ENDPOINT+playlist_id)
        if response.status_code==200:
            print(response.json())
            return JSONResponse({"status": "success", "data": {'playlist_id': playlist_id}})
    else:
        return JSONResponse({"status": "error", "message": "Playlist ID Not Found"})
