from django.core.exceptions import ObjectDoesNotExist
from .models import Notification
from users.models import User

def create_notification(recipient, message):
    """Create a new notification for a user."""
    return Notification.objects.create(recipient=recipient, message=message)

def get_unread_notifications(user):
    """Fetch all unread notifications for a user."""
    return Notification.objects.filter(recipient=user, is_read=False).order_by('-timestamp')

def mark_notification_as_read(notification_id):
    """Mark a notification as read."""
    try:
        notification = Notification.objects.get(id=notification_id)
        notification.is_read = True
        notification.save()
        return notification
    except ObjectDoesNotExist:
        return None

def delete_notification(notification_id):
    """Delete a notification."""
    try:
        notification = Notification.objects.get(id=notification_id)
        notification.delete()
        return True
    except ObjectDoesNotExist:
        return False


