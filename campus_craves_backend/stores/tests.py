from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Store

User = get_user_model()

class StoreTestCase(TestCase):

    def setUp(self):
        """ Create a test seller and store """
        self.seller = User.objects.create_user(email="seller@example.com", username="seller123", password="testpass", role="seller")
        self.store = Store.objects.create(
            seller=self.seller, 
            name="Test Store", 
            location="Test Location", 
            status="open"
        )

    def test_store_creation(self):
        """ Check if store is created correctly """
        self.assertEqual(self.store.name, "Test Store")
        self.assertEqual(self.store.seller.username, "seller123")
