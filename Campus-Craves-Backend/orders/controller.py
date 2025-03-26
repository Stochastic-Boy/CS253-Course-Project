# orders/controller.py
from .models import Order, OrderItem
from cart.models import Cart, CartItem
from notifications.controller import create_notification
from rest_framework.response import Response
from django.utils import timezone

from rest_framework import status
from django.conf import settings
import sendgrid
from sendgrid.helpers.mail import Mail

# Load SendGrid API Key 
SENDGRID_API_KEY = getattr(settings, "SENDGRID_API_KEY", None)

# def checkout_cart(user, store, payment_method, address):
#     try:
#         cart = Cart.objects.get(buyer=user, store=store)  # Fetch cart for the specific store
#     except Cart.DoesNotExist:
#         return None, "No cart found for this user at this store."

#     cart_items = CartItem.objects.filter(cart=cart)
#     if not cart_items.exists():
#         return None, "Cart is empty."

#     # Create order for the given store
#     order = Order.objects.create(
#         user=user,
#         store=store,
#         payment_method=payment_method,
#         delivery_address=address,
#         total_price=sum(i.product.price * i.quantity for i in cart_items),
#     )

#     # Add items to the order
#     for item in cart_items:
#         OrderItem.objects.create(
#             order=order,
#             product=item.product,
#             quantity=item.quantity,
#             price=item.product.price
#         )

#     # Clear the cart after successful order placement
#     cart.items.all().delete()

#     # Notifications
#     create_notification(user, f"Order #{order.id} placed successfully.")
#     create_notification(store.seller, f"New order from {user.username}.")

#     return [order], None  # Return the order in a list to match the original function's return type


# def cancel_order(user, order):
#     if order.user != user:
#         return False, "Unauthorized"
#     if order.status == 'delivered':
#         return False, "Cannot cancel a delivered order"

#     order.status = 'cancelled'
#     order.cancelled_at = timezone.now()
#     order.save()

#     message = "Your order was cancelled. "
#     if order.payment_method == 'Razorpay':
#         message += "Refund will be processed in 2 days."

#     create_notification(user, message)
#     create_notification(order.store.seller, f"Order #{order.id} was cancelled.")

#     try:
#         sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
#         message = Mail(
#             from_email="campus.craves.iitk@gmail.com",
#             to_emails=email,
#             subject=subject,
#             plain_text_content=body,
#         )
#         sg.send(message)
#         return Response({"message": "Email sent successfully."}, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({"error": f"Failed to send email. {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  

# def mark_order_delivered(order, seller):
#     if order.store.seller != seller:
#         return False, "Unauthorized"

#     order.status = "delivered"
#     order.delivered_at = timezone.now()
#     order.save()

#     create_notification(order.user, f"Your order #{order.id} has been delivered!")
#     return True, None

def send_email(to_email, subject, body):
    """Helper function to send email using SendGrid"""
    try:
        sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
        message = Mail(
            from_email="campus.craves.iitk@gmail.com",
            to_emails=to_email,
            subject=subject,
            plain_text_content=body,
        )
        sg.send(message)
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")  # Log the error

def checkout_cart(user, store, payment_method, address):
    try:
        cart = Cart.objects.get(buyer=user, store=store)  
    except Cart.DoesNotExist:
        return None, "No cart found for this user at this store."

    cart_items = CartItem.objects.filter(cart=cart)
    if not cart_items.exists():
        return None, "Cart is empty."

    total_price = sum(i.product.price * i.quantity for i in cart_items)

    # Create order
    order = Order.objects.create(
        user=user,
        store=store,
        payment_method=payment_method,
        delivery_address=address,
        total_price=total_price,
    )

    # Add items to order
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    # Clear the cart
    cart.items.all().delete()

    # Send email notifications
    send_email(user.email, f"Order #{order.id} Placed!", "Your order has been successfully placed.")
    send_email(store.seller.email, f"New Order from {user.username}", f"You have received a new order #{order.id}.")

    return [order], None  


def cancel_order(user, order):
    if order.user != user:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
    if order.status == 'delivered':
        return Response({"error": "Cannot cancel a delivered order"}, status=status.HTTP_400_BAD_REQUEST)

    order.status = 'cancelled'
    order.cancelled_at = timezone.now()
    order.save()

    # Email notifications
    user_message = f"Your order #{order.id} was cancelled."
    if order.payment_method == 'Razorpay':
        user_message += " Refund will be processed in 2 days."

    send_email(user.email, f"Order #{order.id} Cancelled", user_message)
    send_email(order.store.seller.email, f"Order #{order.id} Cancelled", f"Order #{order.id} has been cancelled by the user.")

    return Response({"message": "Order cancelled and notifications sent successfully."}, status=status.HTTP_200_OK)


def mark_order_delivered(order, seller):
    if order.store.seller != seller:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    order.status = "delivered"
    order.delivered_at = timezone.now()
    order.save()

    # Send email notification to user
    send_email(order.user.email, f"Order #{order.id} Delivered", "Your order has been successfully delivered!")

    return Response({"message": "Order marked as delivered and notification sent."}, status=status.HTTP_200_OK)