from django.test import TestCase
from django.contrib.auth import get_user_model
from stores.models import Store
from products.models import Product
from .models import Cart, CartItem

User = get_user_model()

class CartTestCase(TestCase):
    """Tests for Cart functionality"""

    def setUp(self):
        self.user = User.objects.create_user(email="buyer@example.com", password="testpass")
        self.store = Store.objects.create(name="Test Store", seller=self.user)
        self.product = Product.objects.create(name="Test Product", price=10.00, store=self.store)
        self.cart = Cart.objects.create(buyer=self.user, store=self.store)
        self.cart_item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)

    def test_cart_total_price(self):
        """Ensure total price calculation works"""
        self.assertEqual(self.cart.total_price(), 20.00)
