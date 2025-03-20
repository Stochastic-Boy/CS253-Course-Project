from django.db import models
from stores.models import Store

class Category(models.Model):
    """Model to store product categories created by store managers"""
    name = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(Store, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Product(models.Model):
    """Model for a product sold by a store"""
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name
