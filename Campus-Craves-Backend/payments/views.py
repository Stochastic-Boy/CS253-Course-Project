import razorpay
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Payment
from orders.models import Order

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreatePaymentView(APIView):
    """Initiate payment with Razorpay"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        try:
            order = Order.objects.get(id=order_id, buyer=request.user)
            amount = int(order.total_amount * 100)  # Convert to paise for Razorpay
            
            # Create payment order
            payment_data = client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": "1"
            })

            # Save payment record
            Payment.objects.create(
                user=request.user, order=order, amount=order.total_amount,
                method="CARD", transaction_id=payment_data["id"], status="Pending"
            )

            return Response({"payment_id": payment_data["id"], "amount": amount})
        
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

class VerifyPaymentView(APIView):
    """Verify Razorpay Payment"""
    def post(self, request):
        payment_id = request.data.get("razorpay_payment_id")
        order_id = request.data.get("order_id")
        signature = request.data.get("razorpay_signature")

        try:
            payment = Payment.objects.get(transaction_id=order_id)

            # Verify signature
            params = {
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature
            }

            is_valid = client.utility.verify_payment_signature(params)

            if is_valid:
                payment.status = "Paid"
                payment.save()
                return Response({"message": "Payment verified"})
            else:
                return Response({"error": "Payment verification failed"}, status=400)

        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)
