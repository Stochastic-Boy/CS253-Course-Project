from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("recipient", "message", "is_read", "created_at")  # Use 'created_at'
    list_filter = ("is_read", "created_at")  # Use 'created_at'
    search_fields = ("recipient__username", "message")