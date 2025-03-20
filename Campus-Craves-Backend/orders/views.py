# orders/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderSerializer
from .controller import create_order, get_order_by_id, update_order_status, cancel_order, get_orders_by_seller, get_past_orders_by_seller, update_order_status_by_seller
from cart.models import Cart
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

class OrderCreateView(APIView):
    """Create an order from the cart"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        store_id = request.data.get('store_id')
        payment_method = request.data.get('payment_method')
        delivery_address = request.data.get('delivery_address')

        order, error = create_order(user, store_id, payment_method, delivery_address)
        if error:
            return Response({"error": error}, status=400)
        return Response({"message": "Order placed successfully", "order_id": order.id})

class OrderDetailView(APIView):
    """API to fetch a single order"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = get_order_by_id(order_id)
        if order:
            return Response(OrderSerializer(order).data)
        return Response({"error": "Order not found"}, status=404)

class OrderUpdateView(APIView):
    """API to update order status"""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, order_id):
        order = get_order_by_id(order_id)
        if order:
            new_status = request.data.get('status')
            updated_order, error = update_order_status(order, new_status, request.user)
            if error:
                return Response({"error": error}, status=403)
            return Response({"message": "Order status updated"})
        return Response({"error": "Order not found"}, status=404)

class OrderCancelView(APIView):
    """API to cancel an order"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, order_id):
        order = get_order_by_id(order_id)
        if order:
            cancelled_order, error = cancel_order(order, request.user)
            if error:
                return Response({"error": error}, status=403)
            return Response({"message": "Order cancelled successfully"})
        return Response({"error": "Order not found"}, status=404)

class OrderInvoiceView(APIView):
    """Generates a PDF invoice for an order"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id, *args, **kwargs):
        try:
            order = get_order_by_id(order_id)
            if not order or order.buyer != request.user:
                return Response({"error": "Order not found or unauthorized"}, status=404)
            
            order_items = OrderItem.objects.filter(order=order)
            html_content = render_to_string("invoice_template.html", {"order": order, "items": order_items})
            pdf = pdfkit.from_string(html_content, False, configuration=settings.PDFKIT_CONFIG)
            
            response = HttpResponse(pdf, content_type="application/pdf")
            response["Content-Disposition"] = f'attachment; filename="invoice_{order.id}.pdf"'
            return response
        except Exception as e:
            return Response({"error": "An error occurred while generating invoice", "details": str(e)}, status=500)
        


class SellerOrderListView(APIView):
    """Retrieve all orders for a seller's store."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        seller = request.user
        orders = get_orders_by_seller(seller)
        return Response(OrderSerializer(orders, many=True).data)

class SellerPastOrderListView(APIView):
    """Retrieve past orders (completed or canceled) for a seller's store."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        seller = request.user
        orders = get_past_orders_by_seller(seller)
        return Response(OrderSerializer(orders, many=True).data)

class SellerUpdateOrderStatusView(APIView):
    """Allow sellers to update order status."""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, order_id):
        seller = request.user
        new_status = request.data.get("status")

        order, error = update_order_status_by_seller(order_id, new_status, seller)
        if error:
            return Response({"error": error}, status=403)
        return Response({"message": "Order status updated successfully"})
