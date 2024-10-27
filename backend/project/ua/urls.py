from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('login/', views.login),
    path('logout/', views.logout),
    path('signup/', views.signup),
<<<<<<< HEAD
    path('token-refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('check/', views.check_token),
    path('lang/', views.lang),
    path('set2fa/', views.setfact),
    path('get2fa/', views.getfact),
=======
    path('test/', views.test),

    # path('token/', TokenObtainPairView.as_view(), name='token_create'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
]