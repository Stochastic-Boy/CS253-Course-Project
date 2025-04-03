from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Payment
from orders.models import Order
from .controller import create_payment, verify_payment, get_payment_by_order, process_refund

class CreatePaymentView(APIView):
    """ Initiate payment with Razorpay """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        order_id = request.data.get("order_id")
        method = request.data.get("method")
        amount = request.data.get("amount")
        
        try:
            order = Order.objects.get(id=order_id, buyer=user)
            payment = create_payment(user, order, method, amount)
            return Response({"message": "Payment initiated", "transaction_id": payment.transaction_id})
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)


class VerifyPaymentView(APIView):
    """ Verify a payment """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get("payment_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")
        
        payment, error = verify_payment(payment_id, razorpay_payment_id, razorpay_signature)
        if error:
            return Response({"error": error}, status=400)
        return Response({"message": "Payment verified successfully"})


class PaymentDetailView(APIView):
    """ Fetch payment details for an order """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        payment = get_payment_by_order(order_id)
        if payment:
            return Response({"order_id": order_id, "method": payment.method, "status": payment.status})
        return Response({"error": "Payment not found"}, status=404)


class RefundPaymentView(APIView):
    """ Process a refund for an order """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        payment, error = process_refund(order_id)
        if error:
            return Response({"error": error}, status=404)
        return Response({"message": "Refund processed successfully"})
