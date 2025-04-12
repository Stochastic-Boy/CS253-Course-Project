from django.db import models
from users.models import User

class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

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
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()  
    all_objects = models.Manager() 

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

        self.categories.update(is_deleted=True)
        self.products.update(is_deleted=True)

    def _str_(self):
        return f"{self.name} ({self.seller.username})"