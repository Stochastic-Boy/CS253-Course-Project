from django.contrib import admin
from .models import Cart, CartItem

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

class CartAdmin(admin.ModelAdmin):
    list_display = ('buyer', 'store', 'created_at')
    inlines = [CartItemInline]

admin.site.register(Cart, CartAdmin)
