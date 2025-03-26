# users/controller.py
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from .models import User

def get_user_by_email(email):
    """Fetch user by email."""
    try:
        return User.objects.get(email=email)
    except ObjectDoesNotExist:
        return None

def create_user(email, username, password, role):
    """Create a new user."""
    user = User.objects.create_user(email=email, username=username, password=password, role=role)
    return user

def authenticate_user(email, password):
    """Authenticate user with email and password."""
    return authenticate(email=email, password=password)
