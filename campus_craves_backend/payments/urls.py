from django.urls import path
from .views import CreatePaymentView, VerifyPaymentView, PaymentDetailView, RefundPaymentView

urlpatterns = [
    path('create/', CreatePaymentView.as_view(), name="create-payment"),  
    path('verify/', VerifyPaymentView.as_view(), name="verify-payment"), 
    path('<int:order_id>/', PaymentDetailView.as_view(), name="payment-detail"), 
    path('<int:order_id>/refund/', RefundPaymentView.as_view(), name="refund-payment"), 
]
