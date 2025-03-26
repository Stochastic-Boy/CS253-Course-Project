from celery import shared_task
from django.core.mail import send_mail
from .models import Notification

@shared_task
def send_email_notification(notification_id):
    notification = Notification.objects.get(id=notification_id)
    subject = "New Notification - Campus Craves"
    message = notification.message
    recipient_email = notification.recipient.email

    send_mail(subject, message, "no-reply@campuscraves.com", [recipient_email])
