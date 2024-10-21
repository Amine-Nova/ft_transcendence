from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('login/', views.login),
    path('logout/', views.logout),
    path('signup/', views.signup),
    path('token-refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('check/', views.check_token),
    path('lang/', views.lang),
    path('set2fa/', views.setfact),
    path('get2fa/', views.getfact),
]