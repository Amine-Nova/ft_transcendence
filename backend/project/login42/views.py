import os
from django.shortcuts import redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.models import User
import requests

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from ua.views import set_token_cookies
from doublefactor.views import send_otp

UID = os.environ.get('UID')
SECRET = os.environ.get('SECRET')
AUTH_URL = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-675e5069bbc568c9524d521aa9274b1df90a0e67de4c026bf7f003f5899cbdb1&redirect_uri=https%3A%2F%2F127.0.0.1%3A8000%2Flogin42_redir%2F&response_type=code"
REDIRECT_URI = 'https://127.0.0.1:8000/login42_redir/'

def login42(request: HttpRequest):
	return redirect(AUTH_URL)

# Function to exchange authorization code for access token
def exchange_code_for_token(code: str):
    token_url = "https://api.intra.42.fr/oauth/token"
    data = {
        'client_id': UID,
        'client_secret': SECRET,
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    response = requests.post(token_url, data=data)
    print('------------------')
    print(response.status_code)
    print('------------------')

    if response.status_code != 200:
        print("Error during token exchange:", response.content)
        return None
    
    return response.json().get('access_token')

# Function to get user data from 42 API using the access token
def get_42_user_info(access_token: str):
    user_info_url = "https://api.intra.42.fr/v2/me"
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(user_info_url, headers=headers)

    if response.status_code != 200:
        print("Error fetching user info:", response.content)
        return None
    
    return response.json()

# Main view to handle the OAuth redirect
@api_view(['GET'])
def login42_redir(request):
    code = request.GET.get('code')
    if not code:
        return JsonResponse({"error": "Authorization code not provided"}, status=400)
    access_token = exchange_code_for_token(code)
    if not access_token:
        return JsonResponse({"error": "Failed to retrieve access token"}, status=400)
    user_info = get_42_user_info(access_token)
    if not user_info:
        return JsonResponse({"error": "Failed to retrieve user information"}, status=400)
    username = user_info.get('login')
    try:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': user_info.get('email'),
                'first_name': "en",
                'last_name': "f",
            }
        )

        if created:
            print(f"New user {username} created.")
        else:
            print(f"User {username} already exists.")
        
        if user.last_name == "f":
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response =  Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "language": user.first_name,
                "2fa": user.last_name
            }, status=302)

            response.set_cookie(key='access', value=access_token)
            response.set_cookie(key='refresh', value=refresh_token)
            response.set_cookie(key='username', value=username)
            response.set_cookie(key='language', value=User.objects.get(username=username).first_name)

            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
            response['Pragma'] = 'no-cache'
            response['Location'] = "https://127.0.0.1/#dashboard"

        elif user.last_name == "t":
            send_otp(username)

            response =  Response({
                "username": user.username,
                "language": user.first_name,
                "2fa": user.last_name
            }, status=302)

            response.set_cookie(key='username', value=username)
            response.set_cookie(key='language', value=User.objects.get(username=username).first_name)
            response['Location'] = "https://127.0.0.1/#verify"

        return response

    except Exception as e:
        print("Error during user creation:", str(e))
        return JsonResponse({"error": "An error occurred during user creation"}, status=500)