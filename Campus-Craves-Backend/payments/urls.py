from django.urls import path
from .views import CreatePaymentView, VerifyPaymentView

urlpatterns = [
    path('create/', CreatePaymentView.as_view(), name="create-payment"),
    path('verify/', VerifyPaymentView.as_view(), name="verify-payment"),
]
