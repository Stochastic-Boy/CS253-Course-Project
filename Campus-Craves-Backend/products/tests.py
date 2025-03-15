from django.test import TestCase
from django.contrib.auth import get_user_model
from stores.models import Store
from .models import Product

User = get_user_model()

class ProductTestCase(TestCase):
    """Tests for Product model and API"""

    def setUp(self):
        """Create a test seller, store, and product"""
        self.seller = User.objects.create_user(email="seller@example.com", username="seller123", password="testpass", role="seller")
        self.store = Store.objects.create(
            seller=self.seller, 
            name="Test Store", 
            location="Test Location"
        )
        self.product = Product.objects.create(
            store=self.store, 
            name="Test Product", 
            category="snacks", 
            price=9.99, 
            stock=10
        )

    def test_product_creation(self):
        """Check if product is created correctly"""
        self.assertEqual(self.product.name, "Test Product")
        self.assertEqual(self.product.store.name, "Test Store")
