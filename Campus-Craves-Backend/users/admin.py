from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, BuyerProfile, SellerProfile

class CustomUserAdmin(UserAdmin):
    """Customize Django Admin for User model"""
    list_display = ('id', 'email', 'username', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'username')
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role')}
        ),
    )

# Register models
admin.site.register(User, CustomUserAdmin)
admin.site.register(BuyerProfile)
admin.site.register(SellerProfile)
