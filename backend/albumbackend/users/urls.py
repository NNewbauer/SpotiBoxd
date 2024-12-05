from django.urls import path
from .views import login_view, signup, profile_view

urlpatterns = [
    path('login/', login_view, name='login'),  # Use the renamed view
    path('signup/', signup, name='signup'),
    path('profile/', profile_view, name='profile'),
]