from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTestCase(TestCase):
    """Test cases for User authentication"""

    def setUp(self):
        """Create a test user"""
        self.user = User.objects.create_user(
            email="testuser@example.com",
            username="testuser",
            password="testpassword123",
            role="buyer"
        )

    def test_user_creation(self):
        """Ensure the user is created correctly"""
        self.assertEqual(self.user.email, "testuser@example.com")
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.role, "buyer")
        self.assertTrue(self.user.check_password("testpassword123"))

    def test_user_login(self):
        """Ensure the user can log in with correct credentials"""
        login_success = self.client.login(email="testuser@example.com", password="testpassword123")
        self.assertTrue(login_success)

