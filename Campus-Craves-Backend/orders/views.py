from rest_framework import generics, permissions
from .models import Order
from .serializers import OrderSerializer
from notifications.controller import create_notification

class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        create_notification(
            user=self.request.user,
            message=f"Order placed for {order.product.name} (x{order.quantity})."
        )

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_update(self, serializer):
        order = serializer.save()
        create_notification(
            user=self.request.user,
            message=f"Order for {order.product.name} updated to '{order.status}'."
        )

    def perform_destroy(self, instance):
        create_notification(
            user=self.request.user,
            message=f"Order for {instance.product.name} has been cancelled."
        )
        instance.delete()