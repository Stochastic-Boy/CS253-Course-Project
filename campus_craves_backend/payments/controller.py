import razorpay
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from .models import Payment
from orders.models import Order

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def create_payment(user, order, method, amount):
    payment = Payment.objects.create(user=user, order=order, method=method)
    if method != "COD":
        razorpay_order = client.order.create({
            "amount": int(amount * 100),
            "currency": "INR",
            "payment_capture": 1
        })
        payment.transaction_id = razorpay_order["id"]
        payment.save()
    
    return payment


def verify_payment(payment_id, razorpay_payment_id, razorpay_signature):
    params_dict = {
        "razorpay_order_id": payment_id,
        "razorpay_payment_id": razorpay_payment_id,
        "razorpay_signature": razorpay_signature,
    }
    
    try:
        client.utility.verify_payment_signature(params_dict)
        payment = Payment.objects.get(transaction_id=payment_id)
        payment.status = "Success"
        payment.save()
        return payment, None
    except:
        return None, "Payment verification failed"


def get_payment_by_order(order_id):
    try:
        return Payment.objects.get(order_id=order_id)
    except ObjectDoesNotExist:
        return None


def process_refund(order_id):
    try:
        payment = Payment.objects.get(order_id=order_id)
        if payment.method != "COD":
            client.payment.refund(payment.transaction_id)
        payment.status = "Refunded"
        payment.save()
        return payment, None
    except ObjectDoesNotExist:
        return None, "Payment not found"
