from django.shortcuts import redirect
from django.http import HttpRequest, HttpResponse, JsonResponse

import requests

from .models import User
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from ua.views import signup,login

UID = "u-s4t2ud-675e5069bbc568c9524d521aa9274b1df90a0e67de4c026bf7f003f5899cbdb1"
secret = "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"
auth_url = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-675e5069bbc568c9524d521aa9274b1df90a0e67de4c026bf7f003f5899cbdb1&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Flogin42_redir%2F&response_type=code"
REDIRECT_URI = 'http://127.0.0.1:8000/login42_redir/'

def login42(request: HttpRequest):
	return redirect(auth_url)

# Function to exchange authorization code for access token
def exchange_code_for_token(code: str):
    token_url = "https://api.intra.42.fr/oauth/token"
    data = {
        'client_id': UID,
        'client_secret': secret,
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    response = requests.post(token_url, data=data)

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
                'first_name': user_info.get('first_name'),
                'last_name': user_info.get('last_name'),
            }
        )

        if created:
            print(f"New user {username} created.")
        else:
            print(f"User {username} already exists.")

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = HttpResponse(status=302)

        response.set_cookie(key='access', value=access_token)
        response.set_cookie(key='refresh', value=refresh_token)
        response.set_cookie(key='username', value=username)

        response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response['Pragma'] = 'no-cache'
        response['Location'] = "https://127.0.0.1/#dashboard"

        return response

    except Exception as e:
        print("Error during user creation:", str(e))
        return JsonResponse({"error": "An error occurred during user creation"}, status=500)
