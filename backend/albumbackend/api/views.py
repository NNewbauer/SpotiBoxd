from django.http import JsonResponse
import os
from .spotify_service import fetch_albums, get_access_token
from django.http import HttpResponse
import requests

def home(request):
    return HttpResponse("Welcome to the Album Search API!")

def search_albums(request):
    token = get_access_token()
    print(f"SPOTIFY_ACCESS_TOKEN: {token}")
    query = request.GET.get('q', '')
    print(f"Received query: {query}")
    if not query:
        return JsonResponse({'error': 'No search query provided'}, status=400)

    spotify_token = get_access_token()
    print(f"Spotify token: {spotify_token}")
    if spotify_token is None:
        return JsonResponse({'error': 'Spotify token not found'}, status=500)

    try:
        token = get_access_token()
        print(token)
        data = fetch_albums(query, spotify_token)
        print(token)
        albums = [
            {
                'id': album['id'],
                'name': album['name'],
                'artist': album['artists'][0]['name'],
                'image': album['images'][0]['url'] if album['images'] else None,
            }
            for album in data.get('albums', {}).get('items', [])
        ]
        return JsonResponse({'albums': albums})
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Spotify API error', 'details': str(e)}, status=500)
    
def album_details(request):
    album_id = request.GET.get('album_id')
    if not album_id:
        return JsonResponse({'error': 'Album ID not provided'}, status=400)

    token = get_access_token()
    headers = {'Authorization': f'Bearer {token}'}

    # Fetch album details
    album_url = f"https://api.spotify.com/v1/albums/{album_id}"
    album_response = requests.get(album_url, headers=headers)
    if album_response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch album details', 'details': album_response.text}, status=album_response.status_code)

    album_data = album_response.json()

    # Fetch artist details
    artist_id = album_data['artists'][0]['id']
    artist_url = f"https://api.spotify.com/v1/artists/{artist_id}"
    artist_response = requests.get(artist_url, headers=headers)
    if artist_response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch artist details', 'details': artist_response.text}, status=artist_response.status_code)

    artist_data = artist_response.json()

    return JsonResponse({
        'album': {
            'id': album_data['id'],
            'name': album_data['name'],
            'image': album_data['images'][0]['url'] if album_data['images'] else None,
            'tracks': [{'track_number': track['track_number'], 'name': track['name'], 'id': track['id']} for track in album_data['tracks']['items']],
        },
        'artist': {
            'id': artist_data['id'],
            'name': artist_data['name'],
            'banner': artist_data['images'][0]['url'] if artist_data['images'] else None,
        }
    })