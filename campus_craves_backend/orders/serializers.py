from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    # Add fallback for deleted products
    product_info = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'product_info', 'quantity', 'price']
        read_only_fields = ['product_info']
    
    def get_product_info(self, obj):
        """Return stored product info if product was deleted"""
        if obj.product is None:
            return {
                'name': obj.product_name,
                'price': obj.product_price,
                'is_deleted': True
            }
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'store', 'payment_method', 'delivery_address', 'total_price',
                 'status', 'created_at', 'items', 'phone_number']
        read_only_fields = ['user', 'total_price', 'status', 'created_at']