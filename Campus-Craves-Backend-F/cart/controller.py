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

def add_to_cart(user, product_id, quantity):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return None
    cart = get_cart_by_user(user, product.store_id)
    return CartItem.objects.create(cart=cart, product=product, quantity=quantity)

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