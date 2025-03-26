# orders/urls.py
from django.urls import path
from .views import (
    CheckoutView,
    CancelOrderView,
    ConfirmDeliveryView,
    UserOrderListView,
    SellerOrderListView
)

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('cancel/<int:pk>/', CancelOrderView.as_view(), name='cancel-order'),
    path('confirm/<int:pk>/', ConfirmDeliveryView.as_view(), name='confirm-delivery'),
    path('myorders/', UserOrderListView.as_view(), name='user-orders'),
    path('sellerorders/', SellerOrderListView.as_view(), name='seller-orders'),
]