from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ProductSerializer, CategorySerializer
from .controller import create_product, get_all_products, get_product_by_id, update_product, delete_product, get_all_categories, create_category, get_products_by_category

class CategoryCreateView(APIView):
    """API to create a category (Store Manager only)"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        store = request.user.stores.first()
        name = request.data.get("name")

        category, created = create_category(store, name)
        if created:
            return Response({"message": "Category created", "category_id": category.id})
        return Response({"error": "Category already exists"}, status=400)

class CategoryListView(generics.ListAPIView):
    """API to list all categories"""
    queryset = get_all_categories()
    serializer_class = CategorySerializer

class ProductsByCategoryView(APIView):
    """Retrieve all products under a specific category."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, category_id):
        products = get_products_by_category(category_id)
        return Response(ProductSerializer(products, many=True).data)


class ProductCreateView(generics.CreateAPIView):
    """API to create a product (Seller only)"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        store = self.request.user.stores.first()
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
