from django.db import models
from stores.models import Store  # Import Store model

class Product(models.Model):
    """Model for a product sold by a store"""

    CATEGORY_CHOICES = (
        ('snacks', 'Snacks'),
        ('drinks', 'Drinks'),
        ('meals', 'Meals'),
        ('other', 'Other'),
    )

    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.store.name})"
