from rest_framework import serializers
from .models import User, BuyerProfile, SellerProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(password=password, **validated_data)
        return user

class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = ["phone_number", "address"] 


class SellerProfileSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(read_only=True)
    location = serializers.CharField(read_only=True)

    class Meta:
        model = SellerProfile
        fields = ['id', 'user', 'contact_number', 'business_name', 'location']
