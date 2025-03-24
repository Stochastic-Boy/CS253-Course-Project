from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CartItem
from .serializers import CartSerializer, CartItemSerializer
from .controller import get_cart_by_user, add_to_cart, remove_from_cart, clear_cart

class CartView(generics.RetrieveAPIView):
    """Retrieve the cart for a logged-in user"""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_cart_by_user(self.request.user)

class AddToCartView(APIView):
    """Add an item to the cart"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity")
        cart_item = add_to_cart(request.user, product_id, quantity)
        if cart_item:
            return Response({"message": "Item added to cart", "cart_item": CartItemSerializer(cart_item).data})
        return Response({"error": "Product not found"}, status=404)

class RemoveFromCartView(APIView):
    """Remove an item from the cart"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, cart_item_id):
        if remove_from_cart(cart_item_id):
            return Response({"message": "Item removed from cart"})
        return Response({"error": "Item not found"}, status=404)

class ClearCartView(APIView):
    """Clear all items from the cart"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        clear_cart(request.user)
        return Response({"message": "Cart cleared"})
