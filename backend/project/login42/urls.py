from django.contrib import admin
from django.urls import path
from login42 import views

urlpatterns = [
    path('login42/', views.login42, name='login42'),
    path('login42_redir/', views.login42_redir, name='login42_redirect'),
]
