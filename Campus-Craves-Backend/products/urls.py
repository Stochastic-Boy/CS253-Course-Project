from django.urls import path
from .views import ProductCreateView, ProductListView, ProductDetailView
from .views import ProductCreateView, CategoryCreateView, CategoryListView, ProductsByCategoryView

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),  # GET /products/
    path('create/', ProductCreateView.as_view(), name='product-create'),  # POST /products/create/
    path('<int:product_id>/', ProductDetailView.as_view(), name='product-detail'),  # GET, PUT, DELETE /products/<id>/
    path('categories/create/', CategoryCreateView.as_view(), name='category-create'),  # POST /products/categories/create/
    path('categories/', CategoryListView.as_view(), name='category-list'),  # GET /products/categories/
    path('category/<int:category_id>/', ProductsByCategoryView.as_view(), name='products-by-category'),  # GET /products/category/<id>/
]
