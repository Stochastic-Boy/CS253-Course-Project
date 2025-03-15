from django.contrib import admin
from .models import Product

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'store', 'category', 'price', 'stock', 'created_at')
    search_fields = ('name', 'store__name', 'category')
    list_filter = ('category', 'store', 'created_at')

admin.site.register(Product, ProductAdmin)
