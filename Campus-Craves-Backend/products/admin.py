from django.contrib import admin
from .models import Product, Category

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'store', 'category', 'price', 'stock', 'created_at')  # 'created_at' is now part of the model
    search_fields = ('name', 'store__name', 'category__name')  # Corrected to 'category__name'
    list_filter = ('category', 'store', 'created_at')  # 'created_at' is now part of the model

admin.site.register(Product, ProductAdmin)
admin.site.register(Category)  # Registering Category model for the admin interface
