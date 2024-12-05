from django.urls import path
from . import views  # Ensure views.py contains the necessary logic

urlpatterns = [
    path('search_albums/', views.search_albums, name='search_albums'),
    path('album_details/', views.album_details, name='album_details'),
]