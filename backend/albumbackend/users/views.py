from django.contrib.auth import get_user_model, authenticate, login as django_login
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

# Use get_user_model to reference the custom user model
User = get_user_model()

@csrf_exempt
def login_view(request):  # Renamed from `login` to `login_view`
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            identifier = data.get("identifier")  # Accept email or username
            password = data.get("password")

            if not identifier or not password:
                return JsonResponse({"error": "Username/Email and password are required."}, status=400)

            # Try username or email for authentication
            user = authenticate(request, username=identifier, password=password)
            if not user:
                try:
                    user_obj = User.objects.get(email=identifier)
                    user = authenticate(request, username=user_obj.username, password=password)
                except User.DoesNotExist:
                    return JsonResponse({"error": "Invalid credentials."}, status=400)

            if user:
                django_login(request, user)  # Use `django_login` explicitly
                return JsonResponse({
                    "message": "Login successful",
                    "user": {"email": user.email, "username": user.username}
                })
            return JsonResponse({"error": "Invalid credentials."}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)

    return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            username = data.get('username')
            password = data.get('password')

            if not email or not username or not password:
                return JsonResponse({'error': 'All fields are required.'}, status=400)

            # Check if email or username already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists.'}, status=400)
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists.'}, status=400)

            # Create new user
            user = User.objects.create_user(email=email, username=username, password=password)
            return JsonResponse({'message': 'User created successfully.'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    return JsonResponse({
        "username": user.username,
        "email": user.email,
        # Add other details as needed
    })