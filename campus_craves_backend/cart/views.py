from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CartItem
from .serializers import CartSerializer, CartItemSerializer
from .controller import get_cart_by_user, add_to_cart, remove_from_cart, clear_cart

class CartView(generics.RetrieveAPIView):
    """ Retrieves the cart for a specific store """
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        store_id = self.kwargs.get("store_id")
        return get_cart_by_user(self.request.user, store_id)

class AddToCartView(APIView):
    """ Adds a product to the user's cart """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        result = add_to_cart(request.user, product_id, quantity)
        
        if result is None:
            return Response({"error": "Product not found"}, status=404)
        
        # Check if the result is a message dictionary
        if isinstance(result, dict) and "message" in result:
            return Response(result)
        
        # Otherwise, it's a CartItem object
        return Response({
            "message": "Item added" if quantity > 0 else "Item quantity updated",
            "cart_item": CartItemSerializer(result).data
        })


class RemoveFromCartView(APIView):
    """ Removes a specific item from the cart """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, cart_item_id):
        if remove_from_cart(cart_item_id):
            return Response({"message": "Item removed"})
        return Response({"error": "Item not found"}, status=404)

class ClearCartView(APIView):
    """ Clears all items from the user's cart for a store """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, store_id):
        clear_cart(request.user, store_id)
        return Response({"message": "Cart cleared"})