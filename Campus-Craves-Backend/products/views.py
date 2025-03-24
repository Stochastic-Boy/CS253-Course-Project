# views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Product, Category, Store
from .serializers import ProductSerializer, CategorySerializer
from rest_framework.exceptions import ValidationError


class ProductListCreateView(generics.ListCreateAPIView):
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

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(store__seller=self.request.user)

class CategoryListCreateView(generics.ListCreateAPIView):
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

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(store__seller=self.request.user)