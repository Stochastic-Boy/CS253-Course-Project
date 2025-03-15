from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product

class CartView(generics.RetrieveAPIView):
    """Retrieve the cart for a logged-in user"""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Cart.objects.get_or_create(buyer=self.request.user, store=self.request.user.store)[0]

class AddToCartView(APIView):
    """API to add items to the cart"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(buyer=request.user, store=request.user.store)
        product = Product.objects.get(id=request.data.get("product_id"))
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += 1
        cart_item.save()
        return Response({"message": "Product added to cart", "cart": CartSerializer(cart).data})

class UpdateCartItemView(generics.UpdateAPIView):
    """Update quantity of cart items"""
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class RemoveFromCartView(APIView):
    """Remove an item from the cart"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id, *args, **kwargs):
        cart_item = CartItem.objects.get(id=item_id)
        cart_item.delete()
        return Response({"message": "Product removed from cart"})
