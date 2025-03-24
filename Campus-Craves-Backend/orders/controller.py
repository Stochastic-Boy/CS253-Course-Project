# # orders/controller.py
# from django.core.exceptions import ObjectDoesNotExist
# from .models import Order, OrderItem
# from cart.models import Cart, CartItem
# from products.models import Product
# from notifications.controller import create_notification

# def create_order(user, store, payment_method, delivery_address):
#     """Create an order from cart items."""
#     cart = Cart.objects.get(buyer=user, store=store)
#     if not cart.cart_items.exists():
#         return None, "Cart is empty"

#     total_price = sum(item.product.price * item.quantity for item in cart.cart_items.all())
#     order = Order.objects.create(
#         buyer=user,
#         store=store,
#         total_price=total_price,
#         payment_method=payment_method,
#         delivery_address=delivery_address
#     )

#     for cart_item in cart.cart_items.all():
#         OrderItem.objects.create(
#             order=order,
#             product=cart_item.product,
#             quantity=cart_item.quantity,
#             price=cart_item.product.price
#         )

#     cart.cart_items.all().delete()

#     # Notify buyer
#     create_notification(
#         recipient=user,
#         title="Order Placed",
#         message=f"Your order #{order.id} has been successfully placed."
#     )

#     # Notify seller
#     create_notification(
#         recipient=store.seller,
#         title="New Order",
#         message=f"You have a new order from {user.first_name}."
#     )

#     return order, None

# def get_order_by_id(order_id):
#     """Retrieve an order by ID."""
#     try:
#         return Order.objects.get(id=order_id)
#     except ObjectDoesNotExist:
#         return None

# def update_order_status(order, status, user):
#     """Update order status, ensuring only store owners can change it."""
#     if order.store.seller != user:
#         return None, "Unauthorized"
#     order.status = status
#     order.save()

#     # Notify buyer
#     create_notification(
#         recipient=order.buyer,
#         title="Order Status Updated",
#         message=f"Your order #{order.id} status has been updated to {status}."
#     )

#     return order, None

# def cancel_order(order, user):
#     """Allow a buyer to cancel an order if not yet dispatched."""
#     if order.buyer != user:
#         return None, "Unauthorized"
#     if order.status in ["dispatched", "delivered"]:
#         return None, "Cannot cancel order after dispatch"
#     order.status = "cancelled"
#     order.save()

#     # Notify seller
#     create_notification(
#         recipient=order.store.seller,
#         title="Order Cancelled",
#         message=f"Order #{order.id} by {user.first_name} has been cancelled."
#     )

#     return order, None

from .models import Order

def get_user_orders(user):
    return Order.objects.filter(user=user).order_by('-created_at')