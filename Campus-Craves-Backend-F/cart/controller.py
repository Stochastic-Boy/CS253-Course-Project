# cart/controller.py
from .models import Cart, CartItem
from products.models import Product
from stores.models import Store

def get_cart_by_user(user, store_id):
    cart, created = Cart.objects.get_or_create(
        buyer=user,
        store_id=store_id
    )
    return cart

def add_to_cart(user, product_id, quantity_change):
    """Updates the quantity of an item in the user's cart or removes it if quantity reaches zero."""
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return None

    cart = get_cart_by_user(user, product.store_id)

    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        cart_item.quantity += quantity_change  # Update quantity
        if cart_item.quantity <= 0:
            cart_item.delete()  # Remove item if quantity is 0
            return {"message":"Item removed from cart"}
        else:
            cart_item.save()
    else:
        if quantity_change > 0:
            cart_item.quantity = quantity_change
            cart_item.save()
        else:
            return {"message": "Cannot decrease quantity below zero"}  # Do nothing if the first operation is a decrease

    return cart_item



def remove_from_cart(cart_item_id):
    try:
        cart_item = CartItem.objects.get(id=cart_item_id)
        cart_item.delete()
        return True
    except CartItem.DoesNotExist:
        return False

def clear_cart(user, store_id):
    cart = get_cart_by_user(user, store_id)
    cart.items.all().delete()