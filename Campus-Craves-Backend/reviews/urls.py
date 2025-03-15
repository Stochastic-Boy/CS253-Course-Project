from django.urls import path
from .views import ReviewListCreateView, UserReviewListView, ReviewUpdateDeleteView

urlpatterns = [
    path("product/<int:product_id>/", ReviewListCreateView.as_view(), name="product-reviews"),
    path("user/<int:user_id>/", UserReviewListView.as_view(), name="user-reviews"),
    path("<int:pk>/", ReviewUpdateDeleteView.as_view(), name="review-detail"),
]
