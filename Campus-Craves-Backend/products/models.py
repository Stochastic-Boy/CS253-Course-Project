from django.db import models
from stores.models import Store
from django.conf import settings  # Import settings for custom user model

class Category(models.Model):
    """Model to store product categories created by store managers"""
    name = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='categories_created')

    def __str__(self):
        return self.name

class Product(models.Model):
    """Model for a product sold by a store"""
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True, default="No description provided")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Define 'created_at' in the model

    def __str__(self):
        return self.name
