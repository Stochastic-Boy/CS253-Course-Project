from django.test import TestCase
from django.contrib.auth import get_user_model
from orders.models import Order
from .models import Payment

class PaymentTestCase(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email="test@example.com", password="password123")
        self.order = Order.objects.create(buyer=self.user, total_amount=100)

    def test_payment_creation(self):
        payment = Payment.objects.create(user=self.user, order=self.order, method="UPI", amount=100)
        self.assertEqual(payment.status, "Pending")
