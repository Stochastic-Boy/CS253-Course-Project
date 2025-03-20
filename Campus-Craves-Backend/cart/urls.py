from django.urls import path
from .views import CartView, AddToCartView, RemoveFromCartView, ClearCartView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),  # GET /cart/
    path('add/', AddToCartView.as_view(), name='cart-add'),  # POST /cart/add/
    path('item/<int:cart_item_id>/', RemoveFromCartView.as_view(), name='cart-item-remove'),  # DELETE /cart/item/<id>/
    path('clear/', ClearCartView.as_view(), name='cart-clear'),  # DELETE /cart/clear/
]
