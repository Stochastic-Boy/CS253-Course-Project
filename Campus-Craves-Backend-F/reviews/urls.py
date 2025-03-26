from django.urls import path
from .views import (
    ReviewListCreateView, UserReviewListView, StoreReviewListView, ReviewUpdateDeleteView
)

urlpatterns = [
    path("product/<int:product_id>/", ReviewListCreateView.as_view(), name="product-reviews"),  # GET, POST /reviews/product/<id>/
    path("user/<int:user_id>/", UserReviewListView.as_view(), name="user-reviews"),  # GET /reviews/user/<id>/
    path("store/<int:store_id>/", StoreReviewListView.as_view(), name="store-reviews"),  # GET /reviews/store/<id>/
    path("<int:pk>/", ReviewUpdateDeleteView.as_view(), name="review-detail"),  # PUT, DELETE /reviews/<id>/
]
