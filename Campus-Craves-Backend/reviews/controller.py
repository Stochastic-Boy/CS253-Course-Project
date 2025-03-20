from django.core.exceptions import ObjectDoesNotExist
from .models import Review
from products.models import Product
from stores.models import Store

def create_review(user, product_id, rating, comment):
    """Create a review, ensuring a user can only review a product once."""
    try:
        product = Product.objects.get(id=product_id)
        existing_review = Review.objects.filter(user=user, product=product).exists()
        if existing_review:
            return None, "User has already reviewed this product."
        
        review = Review.objects.create(user=user, product=product, rating=rating, comment=comment)
        return review, None
    except ObjectDoesNotExist:
        return None, "Product not found"

def get_reviews_by_product(product_id):
    """Retrieve all reviews for a product."""
    return Review.objects.filter(product_id=product_id).order_by('-created_at')

def get_reviews_by_user(user_id):
    """Retrieve all reviews by a specific user."""
    return Review.objects.filter(user_id=user_id).order_by('-created_at')

def get_reviews_by_store(store_id):
    """Retrieve all reviews for a store based on its products."""
    try:
        products = Product.objects.filter(store_id=store_id)
        return Review.objects.filter(product__in=products).order_by('-created_at')
    except ObjectDoesNotExist:
        return None

def update_review(review, rating, comment):
    """Update an existing review."""
    review.rating = rating
    review.comment = comment
    review.save()
    return review

def delete_review(review):
    """Delete a review."""
    review.delete()
    return True
