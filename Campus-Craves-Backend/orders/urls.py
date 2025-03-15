from django.urls import path
from .views import OrderListView, CreateOrderView, UpdateOrderStatusView, CancelOrderView, OrderInvoiceView

urlpatterns = [
    path('', OrderListView.as_view(), name="order-list"),
    path('create/', CreateOrderView.as_view(), name="order-create"),
    path('<int:pk>/update/', UpdateOrderStatusView.as_view(), name="order-update"),
    path('<int:order_id>/cancel/', CancelOrderView.as_view(), name="order-cancel"),
    path('<int:order_id>/invoice/', OrderInvoiceView.as_view(), name="order-invoice"),
]
