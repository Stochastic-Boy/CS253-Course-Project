from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import update_last_login
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, BuyerProfile, SellerProfile
from .serializers import UserSerializer, BuyerProfileSerializer, SellerProfileSerializer
from django.core.mail import send_mail
import random
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .controller import get_user_by_email, create_user, authenticate_user
from rest_framework.permissions import AllowAny
import json

from django.conf import settings
import random
import sendgrid
from sendgrid.helpers.mail import Mail
from django.contrib.auth.hashers import make_password

# Load SendGrid API Key 
SENDGRID_API_KEY = getattr(settings, "SENDGRID_API_KEY", None)

# Generate OTP Dictionary (Temporary storage)
OTP_STORAGE = {}

def home(request):
    return JsonResponse({"message": "Welcome to Campus Craves API!"})

# User Registration (Buyer/Seller)
class RegisterUser(APIView):
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
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# User Login
class LoginUser(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            update_last_login(None, user)
            return Response({
                "message": "Login successful.",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "role": user.role
            })
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

# User Logout
class LogoutUser(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)

# Profile View & Update (Buyer/Seller)
class UserProfile(RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.user.role == "buyer":
            return BuyerProfileSerializer
        return SellerProfileSerializer

    def get_object(self):
        if self.request.user.role == "buyer":
            return get_object_or_404(BuyerProfile, user=self.request.user)
        return get_object_or_404(SellerProfile, user=self.request.user)

# Send OTP for Password Reset
class SendOTP(APIView):
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

# Send OTP for Email Verification at Signup
class SignupOTP(APIView):
    def post(self, request):
        email = request.data.get('email')

        # Check if the email is already registered
        user = get_user_by_email(email)
        if user:
            return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate OTP
        otp = random.randint(100000, 999999)
        OTP_STORAGE[email] = otp  # Store OTP temporarily
        print(f"OTP: {otp}, OTP_STORAGE: {OTP_STORAGE}")
        
        if not SENDGRID_API_KEY:
            return Response({"error": "SendGrid API Key is missing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Create email content
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
            print(f"SendGrid Response: {response.status_code}, {response.body}")
    
            return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Failed to send OTP. Error: {e}")
            return Response({"error": f"Failed to send OTP. {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Verify OTP for Signup
class VerifyOTP(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = int(request.data.get('otp'))

        print(f"Email: {email}, OTP: {otp}, OTP_STORAGE: {OTP_STORAGE}")
        
        if OTP_STORAGE.get(email) == otp:
            OTP_STORAGE.pop(email)  # Remove OTP after use
            return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

# Verify OTP & Reset Password
class ResetPassword(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = int(request.data.get('otp'))
        new_password = request.data.get('newPassword')

        if OTP_STORAGE.get(email) == otp:
            user = get_user_by_email(email)
            if not user:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            hashed_password = make_password(new_password)
            print(f"New Password: {new_password}, Hashed Password: {hashed_password}")
            if new_password is None:
                    return Response({"error": "New password cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

            user.password = hashed_password
            user.save(using="default")
            print(f"User Password Updated: {user.password}")
            OTP_STORAGE.pop(email)  # Remove OTP after use
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)


class UserProfile(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        # Fix: Always return a valid serializer for Swagger
        if getattr(self, 'swagger_fake_view', False):
            return UserSerializer  # Return a default serializer for documentation

        if not self.request.user.is_authenticated:
            return UserSerializer  # Prevent NoneType error

        if self.request.user.role == "buyer":
            return BuyerProfileSerializer
        return SellerProfileSerializer


@csrf_exempt
def user_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = authenticate_user(data["email"], data["password"])
        if user:
            return JsonResponse({"message": "Login successful", "user_id": user.id})
        return JsonResponse({"error": "Invalid credentials"}, status=400)

@csrf_exempt
def user_signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = create_user(data["email"], data["username"], data["password"], data["role"])
        return JsonResponse({"message": "User created", "user_id": user.id})
