from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from rest_framework.exceptions import NotAuthenticated


class ReviewListCreateView(generics.ListCreateAPIView):
    """List all reviews & allow buyers to create a review"""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs["product_id"])

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ReviewCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserReviewListView(generics.ListAPIView):
    """List all reviews written by a specific user"""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user_id=self.kwargs["user_id"])

class ReviewUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """Allow users to edit or delete their reviews"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Bypass schema generation errors
        if getattr(self, "swagger_fake_view", False):
            return Review.objects.none()
        
        if not self.request.user.is_authenticated:
            raise NotAuthenticated("User must be logged in to access this endpoint.")

        return Review.objects.filter(user=self.request.user)