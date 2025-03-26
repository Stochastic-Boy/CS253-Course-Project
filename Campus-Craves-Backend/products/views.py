# views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product, Category, Store
from .serializers import ProductSerializer, CategorySerializer
from rest_framework.exceptions import ValidationError

# GET /products/public/categories/<store_id>/
# 🔹 View for listing categories in a store (Accessible to Buyers/Public)
class PublicCategoryListView(generics.ListAPIView):
    """
    Allows buyers (or anyone) to view product categories for a specific store.
    No authentication required.
    """
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        store_id = self.kwargs.get('store_id')  # Retrieve from URL path
        return Category.objects.filter(store__id=store_id)

# GET /products/public/products/<store_id>/<category_id>/
# 🔹 View for listing products in a category (Accessible to Buyers/Public)
class PublicProductListView(generics.ListAPIView):
    """
    Allows buyers (or anyone) to view products within a specific category for a given store.
    No authentication required.
    """
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        store_id = self.kwargs.get('store_id')  # Retrieve store ID from path
        category_id = self.kwargs.get('category_id')  # Retrieve category ID from path

        # Ensure both IDs are provided
        if not store_id or not category_id:
            raise ValidationError("Both store_id and category_id are required.")

        return Product.objects.filter(store__id=store_id, category__id=category_id)
    
# GET, POST products/products/
# 🔹 View for listing and creating products (Only for Sellers)
class ProductListCreateView(generics.ListCreateAPIView):
    """
    Allows sellers to view and add products to their store.
    Only the authenticated seller can access and manage their products.
    """
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(store__seller=self.request.user)

    def perform_create(self, serializer):
        try:
            store = Store.objects.get(seller=self.request.user)
            serializer.save(store=store)
        except Store.DoesNotExist:
            raise ValidationError("Store does not exist for this seller.")

# GET, PUT, DELETE /products/products/<product_id>/
# 🔹 View for retrieving, updating, and deleting a specific product (Only for Sellers)
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Allows sellers to retrieve, update, or delete a specific product.
    Only the authenticated seller can manage their own products.
    """
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(store__seller=self.request.user)

# POST, GET /products/categories/
# 🔹 View for listing and creating categories (Only for Sellers)
class CategoryListCreateView(generics.ListCreateAPIView):
    """
    Allows sellers to view and create product categories for their store.
    Only the authenticated seller can manage categories.
    """
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(store__seller=self.request.user)

    def perform_create(self, serializer):
        try:
            store = Store.objects.get(seller=self.request.user)
            serializer.save(store=store)
        except Store.DoesNotExist:
            raise ValidationError("Store does not exist for this seller.")

# PUT, DELETE /products/categories/<category_id>/
# 🔹 View for retrieving, updating, and deleting a specific category (Only for Sellers)
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Allows sellers to retrieve, update, or delete a specific category.
    Only the authenticated seller can manage their own categories.
    """
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(store__seller=self.request.user)