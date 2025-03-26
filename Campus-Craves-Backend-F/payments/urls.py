from django.urls import path
from .views import CreatePaymentView, VerifyPaymentView, PaymentDetailView, RefundPaymentView

urlpatterns = [
    path('create/', CreatePaymentView.as_view(), name="create-payment"),  # POST /payments/create/
    path('verify/', VerifyPaymentView.as_view(), name="verify-payment"),  # POST /payments/verify/
    path('<int:order_id>/', PaymentDetailView.as_view(), name="payment-detail"),  # GET /payments/<order_id>/
    path('<int:order_id>/refund/', RefundPaymentView.as_view(), name="refund-payment"),  # POST /payments/<order_id>/refund/
]
