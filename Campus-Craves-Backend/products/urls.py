from django.urls import path
from .views import ProductCreateView, ProductListView, ProductDetailView

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),  # GET /products/
    path('create/', ProductCreateView.as_view(), name='product-create'),  # POST /products/create/
    path('<int:product_id>/', ProductDetailView.as_view(), name='product-detail'),  # GET, PUT, DELETE /products/<id>/
]
