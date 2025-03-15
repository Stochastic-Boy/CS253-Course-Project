from django.contrib import admin
from .models import Store

class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'seller', 'location', 'status', 'created_at')
    search_fields = ('name', 'seller__username', 'location')
    list_filter = ('status', 'created_at')

admin.site.register(Store, StoreAdmin)
