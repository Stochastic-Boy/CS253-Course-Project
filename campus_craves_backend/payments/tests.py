from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.utils.timezone import now
from users.models import User, BuyerProfile
from orders.models import Order
from products.models import Product, Store, Category
from payments.models import Payment


class PaymentAppTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create users
        self.buyer = User.objects.create_user(
            email="buyer@example.com", username="buyer", password="password", role="buyer"
        )
        self.seller = User.objects.create_user(
            email="seller@example.com", username="seller", password="password", role="seller"
        )

        # Manually create BuyerProfile for the buyer
        self.buyer_profile = BuyerProfile.objects.create(
            user=self.buyer,
            phone_number="1234567890",
            address="123 Test Address"
        )

        # Create store
        self.store = Store.objects.create(
            seller=self.seller,
            name="Test Store",
            description="A test store",
            location="Test Location",
            status="open",
        )

        # Create category and product
        self.category = Category.objects.create(name="Test Category", store=self.store)
        self.product = Product.objects.create(
            name="Test Product",
            description="Description 1",
            price=100,
            store=self.store,
            category=self.category,
        )

        # Create an order for testing
        self.order = Order.objects.create(
            user=self.buyer,
            store=self.store,
            payment_method="UPI",
            total_price=200,
            delivery_address=self.buyer_profile.address,
            status="confirmed"
        )

        # Authenticate buyer for API requests
        self.client.force_authenticate(user=self.buyer)

    def test_create_payment_success(self):
        """Test successful creation of a payment."""
        
        url = reverse("create-payment")
        data = {
            "order_id": self.order.id,
            "method": "UPI",
            "amount": 200.00
        }
        
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Payment initiated", response.data["message"])
        self.assertTrue(Payment.objects.filter(order=self.order).exists())

    def test_create_payment_invalid_order(self):
        """Test creating a payment with an invalid order ID."""
        
        url = reverse("create-payment")
        data = {
            "order_id": 9999,  # Invalid order ID
            "method": "UPI",
            "amount": 200.00
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Order not found", response.data["error"])

    def test_verify_payment_success(self):
        """Test successful verification of a payment."""
        
        payment = Payment.objects.create(
            user=self.buyer,
            order=self.order,
            method="UPI",
            transaction_id="txn_12345",
            amount=200.00,
            status="Pending"
        )
        
        url = reverse("verify-payment")
        data = {
            "payment_id": payment.transaction_id,
            "razorpay_payment_id": "razorpay_12345",
            "razorpay_signature": "signature_12345"
        }
        
        with self.assertLogs("razorpay", level="INFO"):
            response = self.client.post(url, data)
        
        payment.refresh_from_db()
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Payment verified successfully", response.data["message"])
        self.assertEqual(payment.status, "Success")

    def test_verify_payment_failure(self):
        """Test failed verification of a payment."""
        
        payment = Payment.objects.create(
            user=self.buyer,
            order=self.order,
            method="UPI",
            transaction_id="txn_12345",
            amount=200.00,
            status="Pending"
        )
        
        url = reverse("verify-payment")
        data = {
            "payment_id": payment.transaction_id,
            "razorpay_payment_id": "invalid_razorpay_id",
            "razorpay_signature": "invalid_signature"
        }
        
        response = self.client.post(url, data)
        
        payment.refresh_from_db()
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Payment verification failed", response.data["error"])
    
    def test_get_payment_details_success(self):
        """Test fetching payment details for an order."""
        
        payment = Payment.objects.create(
            user=self.buyer,
            order=self.order,
            method="UPI",
            transaction_id="txn_12345",
            amount=200.00,
            status="Success"
        )
        
        url = reverse("payment-detail", args=[self.order.id])
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["order_id"], str(self.order.id))
    
    def test_get_payment_details_not_found(self):
        """Test fetching payment details for an invalid order ID."""
        
        url = reverse("payment-detail", args=[9999])  # Invalid order ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    