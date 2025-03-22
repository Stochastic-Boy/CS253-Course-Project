from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
import pdfkit

from .models import Order, OrderItem
from .serializers import OrderSerializer
from .controller import create_order, update_order_status, cancel_order

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
        order, error = create_order(
            request.user, 
            request.data.get('store_id'), 
            request.data.get('payment_method'), 
            request.data.get('delivery_address')
        )
        if error:
            return Response({"error": error}, status=400)
        return Response({"message": "Order placed successfully", "order_id": order.id}, status=201)

class OrderDetailView(APIView):
    """API to fetch a single order"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, buyer=request.user)
        return Response(OrderSerializer(order).data)

class OrderUpdateView(APIView):
    """API to update order status"""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        updated_order, error = update_order_status(order, request.data.get('status'), request.user)
        if error:
            return Response({"error": error}, status=403)
        return Response({"message": "Order status updated"})

class OrderCancelView(APIView):
    """API to cancel an order"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        cancelled_order, error = cancel_order(order, request.user)
        if error:
            return Response({"error": error}, status=403)
        return Response({"message": "Order cancelled successfully"})

class OrderInvoiceView(APIView):
    """Generates a PDF invoice for an order"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, buyer=request.user)
        order_items = OrderItem.objects.filter(order=order)

        try:
            html_content = render_to_string("invoice_template.html", {"order": order, "items": order_items})
            pdf = pdfkit.from_string(html_content, False, configuration=settings.PDFKIT_CONFIG)

            response = HttpResponse(pdf, content_type="application/pdf")
            response["Content-Disposition"] = f'attachment; filename="invoice_{order.id}.pdf"'
            return response
        except Exception as e:
            return Response({"error": "Failed to generate invoice", "details": str(e)}, status=500)
