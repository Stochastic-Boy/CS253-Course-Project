from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer
from .controller import create_notification, get_unread_notifications, mark_notification_as_read, delete_notification

from rest_framework import status
from django.conf import settings
import sendgrid
from sendgrid.helpers.mail import Mail

# Load SendGrid API Key 
SENDGRID_API_KEY = getattr(settings, "SENDGRID_API_KEY", None)

class OrderNotificationView(APIView):
    def post(self, request):
        email = request.data.get('email')
        event_type = request.data.get('event_type')  # checkout, delivery, payment_success, payment_failure, cancellation
        order_id = request.data.get('order_id')
        
        if not email or not event_type or not order_id:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
        
        subject_map = {
            "checkout": "Campus Craves - Order Checkout",
            "delivery": "Campus Craves - Order Delivered",
            "payment_success": "Campus Craves - Payment Successful",
            "payment_failure": "Campus Craves - Payment Failed",
            "cancellation": "Campus Craves - Order Cancelled"
        }
        
        body_map = {
            "checkout": f"Your order #{order_id} has been checked out successfully!",
            "delivery": f"Your order #{order_id} has been delivered. Enjoy your meal!",
            "payment_success": f"Payment for order #{order_id} was successful. Thank you for your purchase!",
            "payment_failure": f"Payment for order #{order_id} failed. Please try again.",
            "cancellation": f"Your order #{order_id} has been cancelled. Contact support if this was a mistake."
        }
        
        if event_type not in subject_map:
            return Response({"error": "Invalid event type."}, status=status.HTTP_400_BAD_REQUEST)
        
        subject = subject_map[event_type]
        body = body_map[event_type]
        
        if not SENDGRID_API_KEY:
            return Response({"error": "SendGrid API Key is missing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        try:
            sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
            message = Mail(
                from_email="campus.craves.iitk@gmail.com",
                to_emails=email,
                subject=subject,
                plain_text_content=body,
            )
            sg.send(message)
            return Response({"message": "Email sent successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to send email. {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
