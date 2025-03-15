from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.email")  # Show user's email in response
    product_name = serializers.ReadOnlyField(source="product.name")

    class Meta:
        model = Review
        fields = ["id", "user", "product", "product_name", "rating", "comment", "created_at", "updated_at"]

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["product", "rating", "comment"]
