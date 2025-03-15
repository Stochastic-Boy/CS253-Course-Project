from django.urls import path
from .views import ProductCreateView, ProductListView, ProductDetailView

urlpatterns = [
    path('', ProductListView.as_view(), name="product-list"),
    path('create/', ProductCreateView.as_view(), name="product-create"),
    path('<int:pk>/', ProductDetailView.as_view(), name="product-detail"),
]
