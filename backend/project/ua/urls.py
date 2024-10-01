from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('login/', views.login),
    path('logout/', views.logout),
    path('signup/', views.signup),
    path('test/', views.test),
    # path('token/', TokenObtainPairView.as_view(), name='token_create'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]