from django.urls import path
from .views import (
    RegisterUser, LoginUser, LogoutUser, 
    UserProfile, SendOTP, ResetPassword,
    VerifyOTP, SignupOTP, GetUserDetails
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', RegisterUser.as_view(), name='register'),
    path('login/', LoginUser.as_view(), name='login'),
    path('logout/', LogoutUser.as_view(), name='logout'),
    path('profile/', UserProfile.as_view(), name='profile'),
    path('<int:user_id>/', GetUserDetails.as_view(), name='get-user-details'),
    path('send-otp/', SendOTP.as_view(), name='send-otp'),
    path('reset-password/', ResetPassword.as_view(), name='reset-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-otp/', VerifyOTP.as_view(), name='verify-otp'),
    path('signup-otp/', SignupOTP.as_view(), name='signup-otp'),
]

