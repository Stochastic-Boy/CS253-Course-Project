from django.urls import path

from .views import (
    ProductListCreateView,
    ProductDetailView,
    CategoryListCreateView,
    CategoryDetailView
)

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
]

# POST /products/categories/
# GET /products/categories/
# PUT /products/categories/<category_id>/
# DELETE /products/categories/<category_id>/
# POST /products/products/
# GET /products/products/
# PUT /products/products/<product_id>/
# DELETE /products/products/<product_id>/