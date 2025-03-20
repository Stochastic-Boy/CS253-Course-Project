# orders/controller.py
from django.core.exceptions import ObjectDoesNotExist
from .models import Order, OrderItem
from cart.models import Cart, CartItem
from products.models import Product

def create_order(user, store, payment_method, delivery_address):
    """Create an order from cart items."""
    cart = Cart.objects.get(buyer=user, store=store)
    if not cart.cart_items.exists():
        return None, "Cart is empty"
    
    total_price = sum(item.product.price * item.quantity for item in cart.cart_items.all())
    order = Order.objects.create(buyer=user, store=store, total_price=total_price, payment_method=payment_method, delivery_address=delivery_address)
    
    for cart_item in cart.cart_items.all():
        OrderItem.objects.create(order=order, product=cart_item.product, quantity=cart_item.quantity, price=cart_item.product.price)
    
    cart.cart_items.all().delete()
    return order, None

def get_order_by_id(order_id):
    """Retrieve an order by ID."""
    try:
        return Order.objects.get(id=order_id)
    except ObjectDoesNotExist:
        return None

def update_order_status(order, status, user):
    """Update order status, ensuring only store owners can change it."""
    if order.store.seller != user:
        return None, "Unauthorized"
    order.status = status
    order.save()
    return order, None

def cancel_order(order, user):
    """Allow a buyer to cancel an order if not yet dispatched."""
    if order.buyer != user:
        return None, "Unauthorized"
    if order.status in ["dispatched", "delivered"]:
        return None, "Cannot cancel order after dispatch"
    order.status = "cancelled"
    order.save()
    return order, None


def get_orders_by_seller(seller):
    """Retrieve all orders for a seller's store."""
    return Order.objects.filter(store__seller=seller).order_by('-created_at')

def get_past_orders_by_seller(seller):
    """Retrieve completed or canceled orders for a seller."""
    return Order.objects.filter(store__seller=seller, status__in=["delivered", "cancelled"]).order_by('-created_at')

def update_order_status_by_seller(order_id, status, seller):
    """Allow sellers to update order status for their store's orders."""
    try:
        order = Order.objects.get(id=order_id, store__seller=seller)
        order.status = status
        order.save()
        return order, None
    except Order.DoesNotExist:
        return None, "Order not found or unauthorized"
