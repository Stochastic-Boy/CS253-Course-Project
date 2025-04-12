from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product, Category, Store
from .serializers import ProductSerializer, CategorySerializer
from rest_framework.exceptions import ValidationError

class PublicCategoryListView(generics.ListAPIView):
    """ Allows buyers (or anyone) to view product categories for a store """
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        store_id = self.kwargs.get('store_id')
        return Category.objects.filter(store__id=store_id)


class PublicProductListView(generics.ListAPIView):
    """ Allows buyers (or anyone) to view products within a category for a given store """
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        store_id = self.kwargs.get('store_id') 
        category_id = self.kwargs.get('category_id') 
        if not store_id or not category_id:
            raise ValidationError("Both store_id and category_id are required.")

        return Product.objects.filter(store__id=store_id, category__id=category_id)

class ProductListCreateView(generics.ListCreateAPIView):
    """ Allows sellers to view and add products to their store """
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(store__seller=self.request.user)

    def perform_create(self, serializer):
            store = Store.objects.filter(seller=self.request.user, is_deleted=False).first()
            if not store:
                raise ValidationError("Store does not exist or is soft-deleted for this seller.")
            serializer.save(store=store)
    
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ Allows sellers to retrieve, update, or delete a specific product """
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(store__seller=self.request.user)
    
    def perform_destroy(self, instance):
        instance.is_deleted = True   #soft deletion
        instance.save()

class CategoryListCreateView(generics.ListCreateAPIView):
    """ Allows sellers to view and create product categories for their store """
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(store__seller=self.request.user)

    def perform_create(self, serializer):
            store = Store.objects.filter(seller=self.request.user, is_deleted=False).first()
            if not store:
                raise ValidationError("Store does not exist or is soft-deleted for this seller.")
            serializer.save(store=store)

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ Allows sellers to retrieve, update, or delete a specific category """
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(store__seller=self.request.user)

    def perform_destroy(self, instance):
        instance.is_deleted = True   #soft deletion
        instance.save()
