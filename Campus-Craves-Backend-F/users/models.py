from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
from django.contrib.auth.hashers import make_password

# Custom User Manager
class UserManager(BaseUserManager):
    """Manager for custom User model"""

    def create_user(self, email, username, password=None, role="buyer"):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")

        email = self.normalize_email(email)
        hashed_password = make_password(password)
        user = self.model(email=email, username=username, role=role, password=hashed_password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        """Create and return a superuser"""
        user = self.create_user(email, username, password, role="admin")
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

# Custom User Model
class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model supporting Buyer & Seller roles"""

    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    )

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='buyer')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for Django Admin

    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} ({self.role})"

# Buyer Profile Model (Must be defined AFTER User)
class BuyerProfile(models.Model):
    """Profile model for Buyers"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="buyer_profile")
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Buyer Profile: {self.user.username}"

# Seller Profile Model (Must be defined AFTER User)
# class SellerProfile(models.Model):
#     """Profile model for Sellers"""
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="seller_profile")
#     business_name = models.CharField(max_length=255)
#     contact_number = models.CharField(max_length=15)
#     location = models.TextField()

#     def __str__(self):
#         return f"Seller Profile: {self.business_name} ({self.user.username})"

class SellerProfile(models.Model):
    """Profile model for Sellers"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="seller_profile")
    contact_number = models.CharField(max_length=15)

    @property
    def store(self):
        return self.user.store

    @property
    def business_name(self):
        return self.store.name if self.store else "No Store"

    @property
    def location(self):
        return self.store.location if self.store else "No Location"

    def __str__(self):
        return f"Seller Profile: {self.business_name} ({self.user.username})"