from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

################################################

from .serializers import UserSerializer
from rest_framework import status
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
# Create your views here.

@api_view(['POST'])
def login(req):
    user = get_object_or_404(User, username=req.data['username'])
    if not user.check_password(req.data['password']):
        return Response({"detail": "Wrong Password !"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    serializer = UserSerializer(instance=user)
    response =  Response({"user": serializer.data})
    return response

@api_view(['POST'])
def signup(req):
    serializer = UserSerializer(data=req.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=req.data['username'])
        user.set_password(req.data['password'])
        user.save()
        return Response({"user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_username(req):
    user = req.user 
    new_username = req.data.get('username')

    if not new_username:
        return Response({"detail": "username is required."}, status=status.HTTP_400_BAD_REQUEST)
    if user.username == new_username:
        return Response({"detail": "New username cannot be the same as the current username."}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(first_name=new_username).exists():
        return Response({"detail": "This username is already in use."}, status=status.HTTP_400_BAD_REQUEST)
    user.username = new_username
    user.save()
    serializer = UserSerializer(instance=user)
    return Response({"user": serializer.data}, status=status.HTTP_200_OK)