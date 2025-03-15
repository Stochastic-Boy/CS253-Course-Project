from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart, CartItem
import pdfkit
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import render_to_string



class OrderListView(generics.ListAPIView):
    """Retrieve all orders for a logged-in user"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user).order_by('-created_at')

class CreateOrderView(APIView):
    """Create an order from the cart"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cart = Cart.objects.get(buyer=request.user)
        if not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=400)
        
        order = Order.objects.create(
            buyer=request.user,
            store=cart.store,
            total_amount=cart.total_price(),
            payment_method=request.data.get("payment_method"),
            delivery_address=request.data.get("delivery_address")
        )

        for cart_item in cart.items.all():
            OrderItem.objects.create(order=order, product=cart_item.product, quantity=cart_item.quantity, price=cart_item.total_price())

        cart.items.all().delete()
        return Response({"message": "Order placed successfully", "order": OrderSerializer(order).data})

class UpdateOrderStatusView(generics.UpdateAPIView):
    """Allows sellers to update order status"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


class CancelOrderView(APIView):
    """Allows buyers to cancel an order"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, order_id, *args, **kwargs):
        try:
            order = Order.objects.get(id=order_id, buyer=request.user)

            # Prevent cancellation if order is already processed
            if order.status in ["dispatched", "delivered"]:
                return Response({"error": "Cannot cancel order after dispatch"}, status=400)

            order.status = "cancelled"
            order.save()
            return Response({"message": "Order cancelled successfully"})

        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)
        

class OrderInvoiceView(APIView):
    """Generates a PDF invoice for an order"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id, *args, **kwargs):
        try:
            order = Order.objects.get(id=order_id, buyer=request.user)
            order_items = OrderItem.objects.filter(order=order)

            # Render invoice template to HTML
            html_content = render_to_string("invoice_template.html", {"order": order, "items": order_items})

            # Convert HTML to PDF
            pdf = pdfkit.from_string(html_content, False, configuration=settings.PDFKIT_CONFIG)

            # Return PDF response
            response = HttpResponse(pdf, content_type="application/pdf")
            response["Content-Disposition"] = f'attachment; filename="invoice_{order.id}.pdf"'
            return response

        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)
