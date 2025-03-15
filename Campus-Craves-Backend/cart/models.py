from django.db import models
from django.conf import settings
from products.models import Product
from stores.models import Store

class Cart(models.Model):
    """Shopping cart model linked to a buyer"""
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart")
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="carts")
    created_at = models.DateTimeField(auto_now_add=True)

    def total_price(self):
        """Calculates total price of all cart items"""
        return sum(item.total_price() for item in self.items.all())

    def __str__(self):
        return f"Cart of {self.buyer} - {self.store}"

class CartItem(models.Model):
    """Items inside a shopping cart"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)

    def total_price(self):
        """Calculates total price for this cart item"""
        return self.quantity * self.product.price

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Cart {self.cart.id}"
