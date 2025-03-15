from rest_framework import generics, permissions
from .models import Product
from .serializers import ProductSerializer

# Create a Product (Seller Only)
class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(store=self.request.user.stores.first())  # Assume first store

# List All Products
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

# Retrieve, Update, Delete a Product (Seller Only)
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Prevent Swagger from causing errors during schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Product.objects.none()
        return Product.objects.filter(store__seller=self.request.user)
