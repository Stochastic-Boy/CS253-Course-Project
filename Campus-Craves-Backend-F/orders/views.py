# orders/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order, Store
from .serializers import OrderSerializer
from .controller import checkout_cart, cancel_order, mark_order_delivered, send_email
from django.shortcuts import get_object_or_404
from django.utils import timezone

class CheckoutView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        payment_method = request.data.get("payment_method")
        address = request.data.get("delivery_address")
        store_id = request.data.get("store_id")  # Extract store ID from request

        if not address:
            try:
                address = request.user.buyer_profile.address
            except AttributeError:
                address = None

        if not address:
            return Response({"error": "No delivery address provided. Please enter an address in your profile or during checkout."}, status=400)

        # Validate store existence
        try:
            store = Store.objects.get(id=store_id)
        except Store.DoesNotExist:
            return Response({"error": "Invalid store ID. Store does not exist."}, status=400)

        # Proceed with checkout for this store only
        orders, error = checkout_cart(request.user, store, payment_method, address)
        if error:
            return Response({"error": error}, status=400)

        return Response({"message": "Order placed successfully", "orders": [order.id for order in orders]})


class CancelOrderView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        success, msg = cancel_order(request.user, order)
        if not success:
            return Response({"error": msg}, status=403)
        return Response({"message": "Order cancelled."})

class ConfirmDeliveryView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)

        if order.status == "delivered":
            return Response({"message": "Order already marked as delivered."}, status=status.HTTP_200_OK)

        order.status = "delivered"
        order.delivered_at = timezone.now()
        order.save()

        # Send email notifications
        send_email(order.user.email, f"Order #{order.id} Confirmed", "You have confirmed the delivery of your order.")
        send_email(order.store.seller.email, f"Order #{order.id} Delivered", f"The buyer has confirmed the delivery of order #{order.id}.")

        return Response({"message": "Order marked as delivered. Seller has been notified."}, status=status.HTTP_200_OK)

class UserOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class SellerOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(store__seller=self.request.user).order_by('-created_at')