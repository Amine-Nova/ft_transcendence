from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


################################################

from .serializers import UserSerializer
from rest_framework import status
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
# Create your views here.

def set_token_cookies(response, refresh_token, access_token):
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite='None',
    )
    response.set_cookie(
        key='access_token',
        value=access_token,
        samesite='None',
    )

@api_view(['POST'])
def login(req):
    user = get_object_or_404(User, username=req.data['username'])
    if not user.check_password(req.data['password']):
        return Response({"detail": "Wrong Password !"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    serializer = UserSerializer(instance=user)
    refresh = RefreshToken.for_user(user)
    response =  Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }, status=status.HTTP_200_OK)
    set_token_cookies(response, str(refresh), str(refresh.access_token))
    return response

@api_view(['POST'])
def signup(req):
    if User.objects.filter(username=req.data['username']).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=req.data['email']).exists():
        return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)
    serializer = UserSerializer(data=req.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=req.data['username'])
        user.set_password(req.data['password'])
        user.save()
        return Response({"user": serializer.data})
    return Response(serializer.errors)

@api_view(['POST'])
def logout(req):
    try:
        refresh_token = req.COOKIES.get('refresh_token')
        response = Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        response.delete_cookie('username')
        for cookie in req.COOKIES.keys():
            response.delete_cookie(cookie)
        return response
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test(req):
    return Response({"detail": "You are authenticated !"}, status=status.HTTP_200_OK)

