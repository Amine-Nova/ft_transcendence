from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from ua.serializers import UserSerializer
from ua.views import set_token_cookies
from rest_framework import status
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings
from .models import OtpToken
from django.core.mail import send_mail
from django.utils import timezone
from datetime import datetime, timedelta

def send_otp(request):
    username = request.data.get('username')
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        OtpToken.objects.create(user=user, otp_expires_at=timezone.now() + timezone.timedelta(minutes=5))

        otp = OtpToken.objects.filter(user=user).last()

        print(f"one time password is {otp.otp_code}")
        print(f"sending to email :{user.email}")

        subject = "Account Activation"
        message = f"""
            Hi {user.username}, here is your OTP: {otp.otp_code}
            it will expire in 5 minutes. use it to activate your account.
            thanks.
            """
        sender = "tendance1337@gmail.com"
        receiver = [user.email]

        send_mail(subject, message, sender, receiver, fail_silently=False)

    else:
        return Response({"detail": "user not found"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"detail": "new OTP has been sent to your email"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def confirm_account(request):
    user = User.objects.get(username=request.data.get('username'))
    otp = OtpToken.objects.filter(user=user).last()
    if request.data.get('otp') == otp.otp_code:

        if timezone.now() < otp.otp_expires_at:
            user.is_active = True
            user.save()

            serializer = UserSerializer(instance=user)
            refresh = RefreshToken.for_user(user)
            response =  Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "language": user.first_name,
                "2fa": user.last_name
            }, status=status.HTTP_200_OK)
            set_token_cookies(response, str(refresh), str(refresh.access_token))

            return response
        else:
            return Response({"detail": "code has been expired"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail": "code is invalide"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({}, status=status.HTTP_200_OK)


@api_view(['POST'])
def login2fa(req):
    user = get_object_or_404(User, username=req.data['username'])
    if not user.check_password(req.data['password']):
        return Response({"detail": "Wrong Password !"}, status=status.HTTP_406_NOT_ACCEPTABLE)

    send_otp(req)

    return (Response({}, status=status.HTTP_200_OK))

@api_view(['POST'])
def signup2fa(req):
    if User.objects.filter(username=req.data['username']).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=req.data['email']).exists():
        return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)

    send_otp(req)

    serializer = UserSerializer(data=req.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=req.data['username'])
        user.set_password(req.data['password'])
        user.save()
        return Response({"user": serializer.data})
    return Response(serializer.errors)