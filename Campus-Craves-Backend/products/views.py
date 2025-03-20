from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product
from .serializers import ProductSerializer
from .controller import create_product, get_all_products, get_product_by_id, update_product, delete_product

class ProductCreateView(generics.CreateAPIView):
    """API to create a product (Seller only)"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        store = self.request.user.stores.first()  # Ensure correct store selection
        create_product(store, **serializer.validated_data)

class ProductListView(generics.ListAPIView):
    """API to list all products"""
    queryset = get_all_products()
    serializer_class = ProductSerializer

class ProductDetailView(APIView):
    """API to get, update, and delete a product by ID"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, product_id):
        """Fetch product details"""
        product = get_product_by_id(product_id)
        if product:
            return Response(ProductSerializer(product).data)
        return Response({"error": "Product not found"}, status=404)

    def put(self, request, product_id):
        """Update product details"""
        product = get_product_by_id(product_id)
        if product and product.store.seller == request.user:
            update_product(product, **request.data)
            return Response({"message": "Product updated"})
        return Response({"error": "Unauthorized or not found"}, status=403)

    def delete(self, request, product_id):
        """Delete a product"""
        product = get_product_by_id(product_id)
        if product and product.store.seller == request.user:
            delete_product(product)
            return Response({"message": "Product deleted"})
        return Response({"error": "Unauthorized or not found"}, status=403)
