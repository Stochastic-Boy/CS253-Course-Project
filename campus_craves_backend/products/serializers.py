from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'category']
        
    def validate_price(self, value):
        """
        Check that the price is not negative.
        """
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value