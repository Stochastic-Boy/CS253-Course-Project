from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Review
from .serializers import ReviewSerializer
from .controller import (
    create_review, get_reviews_by_product, get_reviews_by_user, get_reviews_by_store,
    update_review, delete_review
)

class ReviewListCreateView(APIView):
    """Retrieve all reviews for a product and allow buyers to add reviews."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, product_id):
        reviews = get_reviews_by_product(product_id)
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request, product_id):
        user = request.user
        rating = request.data.get("rating")
        comment = request.data.get("comment")

        review, error = create_review(user, product_id, rating, comment)
        if error:
            return Response({"error": error}, status=400)
        return Response({"message": "Review added successfully", "review_id": review.id})

class UserReviewListView(APIView):
    """Retrieve all reviews by a specific user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        reviews = get_reviews_by_user(user_id)
        return Response(ReviewSerializer(reviews, many=True).data)

class StoreReviewListView(APIView):
    """Retrieve all reviews for a store based on its products."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, store_id):
        reviews = get_reviews_by_store(store_id)
        if reviews is not None:
            return Response(ReviewSerializer(reviews, many=True).data)
        return Response({"error": "Store not found"}, status=404)

class ReviewUpdateDeleteView(APIView):
    """Allows a user to update or delete their own review."""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            review = Review.objects.get(id=pk, user=request.user)
            rating = request.data.get("rating")
            comment = request.data.get("comment")

            updated_review = update_review(review, rating, comment)
            return Response({"message": "Review updated successfully"})
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=404)

    def delete(self, request, pk):
        try:
            review = Review.objects.get(id=pk, user=request.user)
            delete_review(review)
            return Response({"message": "Review deleted successfully"})
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=404)
