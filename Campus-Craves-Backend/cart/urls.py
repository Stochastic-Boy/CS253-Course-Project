from django.urls import path
from .views import CartView, AddToCartView, RemoveFromCartView, ClearCartView

urlpatterns = [
    path('<int:store_id>/', CartView.as_view(), name='cart-view'),
    path('add/', AddToCartView.as_view(), name='cart-add'),
    path('item/<int:cart_item_id>/', RemoveFromCartView.as_view(), name='cart-item-remove'),
    path('clear/<int:store_id>/', ClearCartView.as_view(), name='cart-clear'),
]
