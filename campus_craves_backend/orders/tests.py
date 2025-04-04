from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.utils.timezone import now

from orders.models import Order, OrderItem
from products.models import Product, Store, Category
from users.models import User, BuyerProfile


class OrdersAppTests(TestCase):
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

        # Create category
        self.category = Category.objects.create(name="Test Category", store=self.store)

        # Create products with category association
        self.product1 = Product.objects.create(
            name="Product 1",
            description="Description 1",
            price=100,
            store=self.store,
            category=self.category,
        )
        
        self.product2 = Product.objects.create(
            name="Product 2",
            description="Description 2",
            price=200,
            store=self.store,
            category=self.category,
        )

        # Authenticate buyer for API requests
        self.client.force_authenticate(user=self.buyer)

    def test_checkout_cart_success(self):
        """Test successful checkout of a cart."""
        
        cart_url = reverse("cart-add")
        checkout_url = reverse("checkout")

        # Add items to cart
        self.client.post(cart_url, {"product_id": self.product1.id, "quantity": 2})
        self.client.post(cart_url, {"product_id": self.product2.id, "quantity": 1})

        # Checkout cart
        response = self.client.post(checkout_url, {
            "store_id": self.store.id,
            "payment_method": "Cash",
            "delivery_address": "123 Test Address"
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Order placed successfully", response.data["message"])

    def test_checkout_cart_empty(self):
        """Test checkout with an empty cart."""
        
        checkout_url = reverse("checkout")

        response = self.client.post(checkout_url, {
            "store_id": self.store.id,
            "payment_method": "Cash",
            "delivery_address": "123 Test Address"
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("No cart found for this user at this store.", response.data["error"])

    def test_checkout_without_phone_number(self):
        """Test checkout fails when buyer profile lacks a phone number."""
        
        # Remove phone number from buyer profile and save changes.
        self.buyer_profile.phone_number = None
        self.buyer_profile.save()

        checkout_url = reverse("checkout")
        
        response = self.client.post(checkout_url, {
            "store_id": self.store.id,
            "payment_method": "Cash",
            "delivery_address": "123 Test Address"
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("No phone number provided.", response.data["error"])

    def test_cancel_order_success(self):
        """Test successful order cancellation."""
        
        order = Order.objects.create(
            user=self.buyer,
            store=self.store,
            payment_method="Cash",
            total_price=300,
            delivery_address="123 Test Address"
        )

        cancel_url = reverse("cancel-order", args=[order.id])
        
        response = self.client.post(cancel_url)
        
        order.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cancel_order_delivered(self):
        """Test cancellation of a delivered order."""
        
        order = Order.objects.create(
            user=self.buyer,
            store=self.store,
            payment_method="Cash",
            total_price=300,
            delivery_address="123 Test Address",
            status="delivered",
            delivered_at=now()
        )

        cancel_url = reverse("cancel-order", args=[order.id])

        response = self.client.post(cancel_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_confirm_delivery_success(self):
        """Test successful confirmation of delivery."""
        
        order = Order.objects.create(
            user=self.buyer,
            store=self.store,
            payment_method="Cash",
            total_price=300,
            delivery_address="123 Test Address",
            status="confirmed"
        )

        confirm_url = reverse("confirm-delivery", args=[order.id])
        
        response = self.client.post(confirm_url)
        
        order.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_confirm_delivery_already_delivered(self):
        """Test confirmation of an already delivered order."""
        
        order = Order.objects.create(
            user=self.buyer,
            store=self.store,
            payment_method="Cash",
            total_price=300,
            delivery_address="123 Test Address",
            status="delivered",
            delivered_at=now()
        )
        confirm_url = reverse("confirm-delivery", args=[order.id])
        response = self.client.post(confirm_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_order_list(self):
       """Test listing all orders for a user."""
       Order.objects.create(
           user=self.buyer,
           store=self.store,
           payment_method="Cash",
           total_price=300,
           delivery_address="123 Test Address"
       )
       url=reverse("user-orders")
       response=self.client.get(url)
       self.assertEqual(response.status_code,status.HTTP_200_OK)
