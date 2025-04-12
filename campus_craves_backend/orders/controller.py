from .models import Order, OrderItem
from cart.models import Cart, CartItem
from rest_framework.response import Response
from django.utils import timezone
from rest_framework import status
from django.conf import settings
import sendgrid
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = getattr(settings, "SENDGRID_API_KEY", None)

def send_email(to_email, subject, body):
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
        print(f"Failed to send email to {to_email}: {str(e)}")  

def checkout_cart(user, store, payment_method, address, phone_number):
    try:
        cart = Cart.objects.get(buyer=user, store=store)  
    except Cart.DoesNotExist:
        return None, "No cart found for this user at this store."

    cart_items = CartItem.objects.filter(cart=cart)
    if not cart_items.exists():
        return None, "Cart is empty."

    total_price = sum(i.product.price * i.quantity for i in cart_items)

    order = Order.objects.create(
        user=user,
        store=store,
        payment_method=payment_method,
        delivery_address=address,
        total_price=total_price,
        phone_number=phone_number
    )


    for item in cart_items:
        
        OrderItem.objects.create(
            order=order,
            product=item.product,
            product_name=item.product.name,  # Add the product_name field
            quantity=item.quantity,
            price=item.product.price
        )

    cart.items.all().delete()

    send_email(user.email, f"Order #{order.id} Placed!", "Your order has been successfully placed.")
    send_email(store.seller.email, f"New Order from {user.username}", f"You have received a new order #{order.id}.")

    return [order], None


def cancel_order(user, order):
    if order.user != user:
        return False, "Unauthorized"
    if order.status == 'delivered':
        return False, "Cannot cancel a delivered order"

    order.status = 'cancelled'
    order.cancelled_at = timezone.now()
    order.save()

    user_message = f"Your order #{order.id} was cancelled."
    if order.payment_method == 'Razorpay':
        user_message += " Refund will be processed in 2 days."

    send_email(user.email, f"Order #{order.id} Cancelled", user_message)
    send_email(order.store.seller.email, f"Order #{order.id} Cancelled", f"Order #{order.id} has been cancelled by the user.")

    return True, "Order cancelled successfully."