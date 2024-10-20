from django.contrib import admin
from django.urls import path
from doublefactor import views

urlpatterns = [
    path('login2fa/', views.login2fa, name='login2fa'),
    path('confirm/', views.confirm_account, name='confirm'),
]
