from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order, Store
from .serializers import OrderSerializer
from .controller import checkout_cart, cancel_order, send_email
from django.shortcuts import get_object_or_404
from django.utils import timezone

class CheckoutView(generics.CreateAPIView):
    """ Handles order checkout and creation """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        payment_method = request.data.get("payment_method")
        address = request.data.get("delivery_address")
        store_id = request.data.get("store_id")  

        if not address:
            try:
                address = request.user.buyer_profile.address
            except AttributeError:
                address = None

        if not address:
            return Response({"error": "No delivery address provided. Please enter an address in your profile."}, status=400)
        
        
        try:
            phone_number = request.user.buyer_profile.phone_number
        except AttributeError:
            phone_number = None

        if not phone_number:
            return Response({"error": "No phone number provided. Please add a phone number to your profile to place an order."}, status=400)

        try:
            store = Store.objects.get(id=store_id)
        except Store.DoesNotExist:
            return Response({"error": "Invalid store ID. Store does not exist."}, status=400)

        orders, error = checkout_cart(request.user, store, payment_method, address, phone_number)
        if error:
            return Response({"error": error}, status=400)

        return Response({"message": "Order placed successfully", "orders": [order.id for order in orders]})

class CancelOrderView(APIView):
    """ Handles order cancellation """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        success, msg = cancel_order(request.user, order)

        if not success:
            return Response({"error": msg}, status=status.HTTP_403_FORBIDDEN)
        return Response({"message": msg}, status=status.HTTP_200_OK)

class ConfirmDeliveryView(generics.UpdateAPIView):
    """ Marks an order as delivered """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        if order.status == "delivered":
            return Response({"error": "Order already marked as delivered."}, status=status.HTTP_400_BAD_REQUEST)
        order.status = "delivered"
        order.delivered_at = timezone.now()
        order.save()

        send_email(order.user.email, f"Order #{order.id} Confirmed", "You have confirmed the delivery of your order.")
        send_email(order.store.seller.email, f"Order #{order.id} Delivered", f"The buyer has confirmed the delivery of order #{order.id}.")

        return Response({"message": "Order Delivered."}, status=status.HTTP_200_OK)

class UserOrderListView(generics.ListAPIView):
    """ Lists all orders of a user """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class SellerOrderListView(generics.ListAPIView):
    """ Lists all orders for a seller """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(store__seller=self.request.user).order_by('-created_at')