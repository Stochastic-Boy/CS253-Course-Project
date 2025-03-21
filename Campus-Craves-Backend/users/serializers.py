from rest_framework import serializers
from .models import User, BuyerProfile, SellerProfile

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration and details"""

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """Create and return a new user with an encrypted password"""
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class BuyerProfileSerializer(serializers.ModelSerializer):
    """Serializer for Buyer Profile"""

    class Meta:
        model = BuyerProfile
        fields = '__all__'

class SellerProfileSerializer(serializers.ModelSerializer):
    """Serializer for Seller Profile"""

    class Meta:
        model = SellerProfile
        fields = '__all__'

