from django.urls import path

from .views import (
    ProductListCreateView,
    ProductDetailView,
    CategoryListCreateView,
    CategoryDetailView,
    PublicCategoryListView,
    PublicProductListView
)

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('public/categories/<int:store_id>/', PublicCategoryListView.as_view(), name='public-category-list'),
    path('public/products/<int:store_id>/<int:category_id>/', PublicProductListView.as_view(), name='public-product-list')
]

