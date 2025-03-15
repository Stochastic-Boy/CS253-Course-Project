from django.db import models
from django.contrib.auth import get_user_model  # ✅ Correct way to get the custom User model

User = get_user_model()  # Ensure this is used

class Notification(models.Model):
    RECIPIENT_TYPES = [
        ("buyer", "Buyer"),
        ("seller", "Seller"),
    ]

    recipient = models.ForeignKey(
        User,  # This must refer to the correct User model
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    recipient_type = models.CharField(max_length=10, choices=RECIPIENT_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.recipient.username} - {self.message}"
