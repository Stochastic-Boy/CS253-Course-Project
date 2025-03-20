from django.core.exceptions import ObjectDoesNotExist
from .models import Product

def create_product(store, name, description, price, stock, category):
    """Create a new product for a store."""
    return Product.objects.create(store=store, name=name, description=description, price=price, stock=stock, category=category)

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