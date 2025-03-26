from django.db import models
from users.models import User

class Store(models.Model):
    """Model for a store managed by sellers"""

    STATUS_CHOICES = (
        ('open', 'Open'),
        ('closed', 'Closed'),
    )

    seller = models.OneToOneField(User, on_delete=models.CASCADE, related_name="store")
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')

    def _str_(self):
        return f"{self.name} ({self.seller.username})"