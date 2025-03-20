# orders/urls.py
from django.urls import path
from .views import (
    OrderListView, OrderCreateView, OrderDetailView, OrderUpdateView, OrderCancelView, OrderInvoiceView,
    SellerOrderListView, SellerPastOrderListView, SellerUpdateOrderStatusView
)

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),  # GET /orders/
    path('create/', OrderCreateView.as_view(), name='order-create'),  # POST /orders/create/
    path('<int:order_id>/', OrderDetailView.as_view(), name='order-detail'),  # GET /orders/<id>/
    path('<int:order_id>/update/', OrderUpdateView.as_view(), name='order-update'),  # PUT /orders/<id>/update/
    path('<int:order_id>/cancel/', OrderCancelView.as_view(), name='order-cancel'),  # DELETE /orders/<id>/cancel/
    path('<int:order_id>/invoice/', OrderInvoiceView.as_view(), name='order-invoice'),  # GET /orders/<id>/invoice/

     path('seller/orders/', SellerOrderListView.as_view(), name='seller-orders'),  # GET /orders/seller/orders/
    path('seller/past-orders/', SellerPastOrderListView.as_view(), name='seller-past-orders'),  # GET /orders/seller/past-orders/
    path('seller/order/<int:order_id>/update/', SellerUpdateOrderStatusView.as_view(), name='seller-order-update'),  # PUT /orders/seller/order/<id>/update/
]