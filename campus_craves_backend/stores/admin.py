from django.contrib import admin
from .models import Store

class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'seller', 'location', 'status')
    search_fields = ('name', 'seller__username', 'location')
    list_filter = ('status',)

admin.site.register(Store, StoreAdmin)