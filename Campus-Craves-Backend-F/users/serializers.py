from rest_framework import serializers
from .models import User, BuyerProfile, SellerProfile

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration and details"""

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """Create and return a new user with an encrypted password"""
        password = validated_data.pop('password', None)
        user = User.objects.create_user(password=password, **validated_data)
        return user

class BuyerProfileSerializer(serializers.ModelSerializer):
    """Serializer for Buyer Profile"""

    class Meta:
        model = BuyerProfile
        fields = ["phone_number", "address"]  # 🔥 Exclude `user` from fields


class SellerProfileSerializer(serializers.ModelSerializer):
    """Serializer for Seller Profile"""

    class Meta:
        model = SellerProfile
        fields = '__all__'


