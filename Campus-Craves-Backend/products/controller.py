from django.core.exceptions import ObjectDoesNotExist
from .models import Product, Category

def create_category(store, name):
    """Create a new category for a store"""
    category, created = Category.objects.get_or_create(name=name, created_by=store)
    return category, created

def get_all_categories():
    """Retrieve all categories"""
    return Category.objects.all()

def get_products_by_category(category_id):
    """Retrieve all products belonging to a specific category."""
    return Product.objects.filter(category_id=category_id)


def create_product(store, name, description, price, stock, category_id):
    """Create a new product for a store"""
    try:
        category = Category.objects.get(id=category_id)
        return Product.objects.create(store=store, name=name, description=description, price=price, stock=stock, category=category)
    except ObjectDoesNotExist:
        return None

def get_all_products():
    """Retrieve all products."""
    return Product.objects.all()

def get_product_by_id(product_id):
    """Retrieve a product by its ID."""
    try:
        return Product.objects.get(id=product_id)
    except ObjectDoesNotExist:
        return None

def update_product(product, name, description, price, stock, category):
    """Update product details."""
    product.name = name
    product.description = description
    product.price = price
    product.stock = stock
    product.category = category
    product.save()
    return product

def delete_product(product):
    """Delete a product."""
    product.delete()