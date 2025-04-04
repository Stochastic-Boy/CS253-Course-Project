from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import update_last_login
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, BuyerProfile, SellerProfile
from .serializers import UserSerializer, BuyerProfileSerializer, SellerProfileSerializer
import random
from django.http import JsonResponse
from .controller import get_user_by_email, create_user, authenticate_user
from rest_framework.permissions import AllowAny
import json
from django.conf import settings
import random
import sendgrid
from sendgrid.helpers.mail import Mail
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError

SENDGRID_API_KEY = getattr(settings, "SENDGRID_API_KEY", None)

OTP_STORAGE = {}

def home(request):
    return JsonResponse({"message": "Welcome to Campus Craves API!"})


class RegisterUser(APIView):
    """ Registers a new user """

    permission_classes = [AllowAny]
    def post(self, request):
        role = request.data.get('role')
        password = request.data.get('password')
        email = request.data.get('email') 
        username = request.data.get('username')
        if role not in ["buyer", "seller"]:
            return Response({"error": "Invalid role specified."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(email=email, username=username, password=password, role=role)
            if role == "buyer":
                BuyerProfile.objects.create(user=user)
            else:
                SellerProfile.objects.create(user=user)
            refresh = RefreshToken.for_user(user)
 
            user_data = UserSerializer(user).data
 
            return Response({
                "message": "User registered successfully.",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user": user_data  
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUser(APIView):
    """ Authenticates user and provides JWT tokens """
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            update_last_login(None, user)
            user_data = UserSerializer(user).data 
            return Response({
                "message": "Login successful.",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user" : user_data
            })
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutUser(APIView):
    """ Logs out the user """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)


class UserProfile(RetrieveUpdateDestroyAPIView):
    """ Allows authenticated users to retrieve, update, or delete their profile """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.user.role == "buyer":
            return BuyerProfileSerializer
        return SellerProfileSerializer

    def get_object(self):  
        if self.request.user.role == "buyer":
            return get_object_or_404(BuyerProfile, user=self.request.user)
        return get_object_or_404(SellerProfile, user=self.request.user)

    def perform_update(self, serializer):  
        if not self.request.data:
            raise ValidationError({"error": "No updates provided "})

        serializer.save(user=self.request.user)


class GetUserDetails(APIView):
    """ Retrieves user details and profile """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)

        if user.role == "buyer":
            profile = get_object_or_404(BuyerProfile, user=user)
            serializer = BuyerProfileSerializer(profile)
        else:
            profile = get_object_or_404(SellerProfile, user=user)
            serializer = SellerProfileSerializer(profile)

        return Response({
            "user": UserSerializer(user).data,
            "profile": serializer.data
        }, status=status.HTTP_200_OK)


class SendOTP(APIView):
    """ Sends OTP for password reset """
    def post(self, request):
        email = request.data.get('email')
        user = get_user_by_email(email)
        
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        otp = random.randint(100000, 999999)
        OTP_STORAGE[email] = otp  
        
        if not SENDGRID_API_KEY:
            return Response({"error": "SendGrid API Key is missing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        subject = "Campus Craves - Password Reset OTP"
        body = f"Your OTP for password reset is: {otp}\n\nIf you did not request this, please ignore this email."

        try:
            sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
            message = Mail(
                from_email="campus.craves.iitk@gmail.com",
                to_emails=email,
                subject=subject,
                plain_text_content=body,
            )
            sg.send(message)
            return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to send OTP. {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SignupOTP(APIView):
    """ Sends OTP for email verification at Signup """
    def post(self, request):
        email = request.data.get('email')

        user = get_user_by_email(email)
        if user:
            return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)
        
        otp = random.randint(100000, 999999)
        OTP_STORAGE[email] = otp  
        
        if not SENDGRID_API_KEY:
            return Response({"error": "SendGrid API Key is missing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        subject = "Campus Craves - Email Verification OTP"
        body = f"Your OTP for email verification is: {otp}\n\nPlease enter this OTP to complete your registration."

        try:
            sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
            
            message = Mail(
                from_email="campus.craves.iitk@gmail.com",
                to_emails=email,
                subject=subject,
                plain_text_content=body,
            )
            
            response = sg.send(message)
    
            return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to send OTP. {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTP(APIView):
    """ Verifies OTP """
    def post(self, request):
        email = request.data.get('email')
        otp = int(request.data.get('otp'))
   
        if OTP_STORAGE.get(email) == otp:
            OTP_STORAGE.pop(email)  
            return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)


class ResetPassword(APIView):
    """ Resets user password after OTP verification """
    def post(self, request):
        email = request.data.get('email')
        otp = int(request.data.get('otp'))
        new_password = request.data.get('newPassword')

        if OTP_STORAGE.get(email) == otp:
            user = get_user_by_email(email)
            if not user:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            hashed_password = make_password(new_password)
            if new_password is None:
                    return Response({"error": "New password cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

            user.password = hashed_password
            user.save(using="default")
            OTP_STORAGE.pop(email)  
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)