from rest_framework import serializers
from .models import Order
from products.serializers import ProductSerializer

class OrderSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'product', 'product_details', 'quantity', 'status', 'created_at']
        read_only_fields = ['user', 'created_at']