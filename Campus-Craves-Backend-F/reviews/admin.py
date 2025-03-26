from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "rating", "created_at")
    search_fields = ("user__email", "product__name")
    list_filter = ("rating", "created_at")
