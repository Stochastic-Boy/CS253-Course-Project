from django.core.exceptions import ObjectDoesNotExist
from .models import Cart, CartItem
from products.models import Product

def get_cart_by_user(user, store):
    """Retrieve or create a cart for a user and store."""
    cart, created = Cart.objects.get_or_create(buyer=user, store=store)
    return cart

def add_to_cart(user, product_id, quantity):
    """Add a product to the user's cart."""
    try:
        product = Product.objects.get(id=product_id)
        cart = get_cart_by_user(user, product.store)  # Ensure cart is linked to the correct store
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            cart_item.quantity += quantity
        
        cart_item.save()
        return cart_item
    except ObjectDoesNotExist:
        return None

def remove_from_cart(cart_item_id):
    """Remove an item from the cart."""
    try:
        cart_item = CartItem.objects.get(id=cart_item_id)
        cart_item.delete()
        return True
    except ObjectDoesNotExist:
        return False

def clear_cart(user, store):
    """Remove all items from the user's cart for a specific store."""
    cart = get_cart_by_user(user, store)
    cart.items.all().delete()  # Fix related name
    return True
