from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CartItem
from .serializers import CartSerializer, CartItemSerializer
from .controller import get_cart_by_user, add_to_cart, remove_from_cart, clear_cart

class CartView(generics.RetrieveAPIView):
    """
    GET /cart/<store_id> => retrieve cart for a store
    """
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        store_id = self.kwargs.get("store_id")
        return get_cart_by_user(self.request.user, store_id)

class AddToCartView(APIView):
    """
    POST /cart/add/
    Body: { product_id, quantity }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity", 1)
        cart_item = add_to_cart(request.user, product_id, quantity)
        if cart_item:
            return Response({"message": "Item added", "cart_item": CartItemSerializer(cart_item).data})
        return Response({"error": "Product not found"}, status=404)

class RemoveFromCartView(APIView):
    """
    DELETE /cart/item/<cart_item_id>/
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, cart_item_id):
        if remove_from_cart(cart_item_id):
            return Response({"message": "Item removed"})
        return Response({"error": "Item not found"}, status=404)

class ClearCartView(APIView):
    """
    DELETE /cart/clear/<store_id>/
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, store_id):
        clear_cart(request.user, store_id)
        return Response({"message": "Cart cleared"})