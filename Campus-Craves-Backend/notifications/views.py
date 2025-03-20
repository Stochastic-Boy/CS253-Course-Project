from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer
from .controller import create_notification, get_unread_notifications, mark_notification_as_read, delete_notification

class NotificationListView(generics.ListAPIView):
    """Retrieve all unread notifications for the logged-in user."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return get_unread_notifications(self.request.user)

class CreateNotificationView(APIView):
    """Create a new notification for a user."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        recipient_id = request.data.get("recipient_id")
        message = request.data.get("message")

        try:
            recipient = User.objects.get(id=recipient_id)
            notification = create_notification(recipient, message)
            return Response({"message": "Notification sent", "notification_id": notification.id})
        except User.DoesNotExist:
            return Response({"error": "Recipient not found"}, status=404)

class MarkNotificationReadView(APIView):
    """Mark a notification as read."""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, notification_id):
        notification = mark_notification_as_read(notification_id)
        if notification:
            return Response({"message": "Notification marked as read"})
        return Response({"error": "Notification not found"}, status=404)

class DeleteNotificationView(APIView):
    """Delete a notification."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, notification_id):
        success = delete_notification(notification_id)
        if success:
            return Response({"message": "Notification deleted"})
        return Response({"error": "Notification not found"}, status=404)
