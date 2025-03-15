from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'order', 'method', 'status', 'amount', 'created_at')
    search_fields = ('user__email', 'order__id', 'transaction_id')
    list_filter = ('status', 'method')

