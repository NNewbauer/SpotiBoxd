# spotify_service.py
import requests
from decouple import config

SPOTIFY_CLIENT_ID = config('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = config('SPOTIFY_CLIENT_SECRET')
print(f"SPOTIFY_CLIENT_ID: {SPOTIFY_CLIENT_ID}")
print(f"SPOTIFY_CLIENT_SECRET: {SPOTIFY_CLIENT_SECRET}")

def get_access_token():
    client_id = SPOTIFY_CLIENT_ID
    client_secret = SPOTIFY_CLIENT_SECRET
    print(f"Client ID: {client_id}")
    print(f"Client Secret: {client_secret}")

    url = 'https://accounts.spotify.com/api/token'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    data = {
        'grant_type': 'client_credentials',
    }

    response = requests.post(url, headers=headers, data=data, auth=(client_id, client_secret))
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        print(f"Failed to fetch access token: {response.status_code} {response.text}")
        raise Exception(f"Failed to fetch access token: {response.status_code} {response.text}")
    
def fetch_albums(query, token):
    headers = {'Authorization': f'Bearer {token}'}
    url = f'https://api.spotify.com/v1/search?q={query}&type=album'

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Spotify API error: {response.status_code} {response.text}")
        raise Exception(f"Spotify API error: {response.status_code} {response.text}")