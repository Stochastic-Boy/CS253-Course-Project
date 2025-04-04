import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from users.models import BuyerProfile  
from users.views import OTP_STORAGE
from unittest.mock import patch
import random

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user():
    def make_user(**kwargs):
        return User.objects.create_user(**kwargs)
    return make_user

@pytest.fixture
def authenticated_client(api_client, create_user):
    user = create_user(email="test@example.com", username="testuser", password="password123", role="buyer")
    BuyerProfile.objects.create(user=user, address="Dorm 1")  
    api_client.force_authenticate(user=user)
    return api_client, user


### REGISTER USER TESTS ###
@pytest.mark.django_db
@pytest.mark.parametrize("data, expected_status", [
    ({"email": "newuser@example.com", "username": "newuser", "password": "newpassword", "role": "buyer"}, status.HTTP_201_CREATED),
    ({"email": "", "username": "newuser", "password": "newpassword", "role": "buyer"}, status.HTTP_400_BAD_REQUEST),
    ({"email": "newuser@example.com", "username": "", "password": "newpassword", "role": "buyer"}, status.HTTP_400_BAD_REQUEST),
    ({"email": "newuser@example.com", "username": "newuser", "password": "newpassword", "role": "invalid_role"}, status.HTTP_400_BAD_REQUEST),
])
def test_register_user(api_client, data, expected_status):
    response = api_client.post("/users/signup/", data)
    assert response.status_code == expected_status

@pytest.mark.django_db
def test_register_duplicate_user(api_client, create_user):
    create_user(email="test@example.com", username="testuser", password="password123", role="buyer")
    data = {"email": "test@example.com", "username": "testuser", "password": "password123", "role": "buyer"}
    response = api_client.post("/users/signup/", data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "user with this email already exists." in response.data["email"]


### LOGIN USER TESTS ###
@pytest.mark.django_db
def test_login(api_client, create_user):
    create_user(email="test@example.com", username="testuser", password="password123", role="buyer")

    data = {"email": "test@example.com", "password": "password123"}
    response = api_client.post("/users/login/", data)
    
    assert response.status_code == status.HTTP_200_OK
    assert "access_token" in response.data
    assert response.data["user"]["email"] == "test@example.com"

@pytest.mark.django_db
@pytest.mark.parametrize("data, expected_status", [
    ({"email": "test@example.com", "password": "wrongpassword"}, status.HTTP_401_UNAUTHORIZED),
    ({"email": "wrongemail@example.com", "password": "password123"}, status.HTTP_401_UNAUTHORIZED),
])
def test_login_invalid_creds(api_client, create_user, data, expected_status):
    create_user(email="test@example.com", username="testuser", password="password123", role="buyer")

    response = api_client.post("/users/login/", data)
    assert response.status_code == expected_status
    assert "Invalid credentials." in response.data["error"]


### LOGOUT USER TESTS ###
@pytest.mark.django_db
def test_logout_success(authenticated_client):
    client, _ = authenticated_client
    response = client.post("/users/logout/")
    
    assert response.status_code == status.HTTP_200_OK
    assert "Logout successful." in response.data["message"]

@pytest.mark.django_db
def test_logout_failure(api_client):
    response = api_client.post("/users/logout/")   ## Unauthenticated user trying to logout

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authentication credentials were not provided" in response.data["detail"]


### USER PROFILE TESTS ###
@pytest.mark.django_db
def test_get_profile_success(authenticated_client):
    client, user = authenticated_client
    response = client.get("/users/profile/")
    
    assert response.status_code == status.HTTP_200_OK
    assert response.data["address"] == "Dorm 1"  
    assert response.data["phone_number"] is None  
    assert user.email == "test@example.com"    

@pytest.mark.django_db
def test_get_profile_failure(api_client):
    response = api_client.get("/users/profile/")  # No authentication

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authentication credentials were not provided" in response.data["detail"]
   

### PROFILE UPDATE TESTS ###
@pytest.mark.django_db
def test_update_user_profile(authenticated_client):
    client, user = authenticated_client
    data = {"address": "Updated address"}

    response = client.patch("/users/profile/", data)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["address"] == "Updated address"
    assert response.data["phone_number"] is None

@pytest.mark.django_db
def test_update_user_profile_empty(authenticated_client):
    client, _ = authenticated_client
    response = client.patch("/users/profile/", {})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "No updates provided" in response.data["error"]


### GET USER DETAILS TEST ###
@pytest.mark.django_db
def test_get_user_details(authenticated_client):
    client, user = authenticated_client
 
    response = client.get(f"/users/{user.id}/")

    assert response.status_code == status.HTTP_200_OK

    assert response.data["user"]["email"] == user.email
    assert response.data["user"]["username"] == user.username
   

### OTP TESTS ###
@pytest.mark.django_db
@patch("random.randint", return_value=123456)
@patch("sendgrid.SendGridAPIClient.send")
def test_verify_otp_success(mock_send, mock_randint, api_client):
    email = "newuser@example.com"

    api_client.post("/users/signup-otp/", {"email": email})

    response = api_client.post("/users/verify-otp/", {"email": email, "otp": 123456})  # correct OTP

    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "OTP verified successfully."


@pytest.mark.django_db
def test_verify_otp_failure(api_client):
    email = "newuser@example.com"

    response = api_client.post("/users/verify-otp/", {"email": email, "otp": 999999})  # incorrect OTP

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["error"] == "Invalid OTP."


@pytest.mark.django_db
@patch("random.randint", return_value=123456)
@patch("sendgrid.SendGridAPIClient.send")
def test_reset_password_success(mock_send, mock_randint, api_client, create_user):
    create_user(email="reset@example.com", username="resetuser", password="oldpassword", role="buyer")
    
    response = api_client.post("/users/send-otp/", {"email": "reset@example.com"})
    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "OTP sent successfully."

    response = api_client.post("/users/reset-password/", {
        "email": "reset@example.com",
        "otp": 123456,
        "newPassword": "newpassword"
    })

    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Password reset successful."


@pytest.mark.django_db
def test_reset_password_failure(api_client):
    email = "reset@example.com"

    response = api_client.post("/users/reset-password/", {
        "email": email,
        "otp": 123456,  
        "newPassword": "newpassword"
    })

    assert response.status_code == status.HTTP_400_BAD_REQUEST     # Resetting password without verification of OTP
    assert response.data["error"] == "Invalid OTP."