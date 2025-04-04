import pytest
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import CartItem 
from stores.models import Store  
from products.models import Product, Category
from rest_framework.test import APIClient
from .serializers import CartItemSerializer

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user(db):
    def make_user(email=None, username=None, password="password123", role="seller"):
        count = User.objects.count()
        email = email or f"user{count}@example.com"
        username = username or f"user{count}"
        return User.objects.create_user(email=email, username=username, password=password, role=role)
    return make_user

@pytest.fixture
def authenticated_seller_client(api_client, create_user):
    seller = create_user()
    api_client.force_authenticate(user=seller)
    return api_client,seller

@pytest.fixture
def authenticated_buyer_client(api_client, create_user):
    buyer = create_user(role="buyer") 
    api_client.force_authenticate(user=buyer)
    return api_client,buyer

@pytest.fixture
def create_store(db, create_user):
    def make_store(name="Test Store", seller=None):
        if not seller:
            seller = create_user()
        return Store.objects.create(name=name, description="Sample Store", location="City", status="open", seller=seller)
    return make_store

@pytest.fixture
def create_product(db, create_store):
    def make_product(name="Test Product", store=None, category=None):
        if not store:
            store = create_store()
        if category is None:
            category, _ = Category.objects.get_or_create(name="Default Category", store=store)
        return Product.objects.create(name=name, description="Sample product", category=category, price=10.0, store=store)
    return make_product

@pytest.mark.django_db
def test_cart_operations(authenticated_seller_client, authenticated_buyer_client, create_store, create_product):
    """Test adding, retrieving, removing, and clearing items from the cart in sequence"""
    seller_client,seller = authenticated_seller_client
    buyer_client,buyer = authenticated_buyer_client

    store = create_store()
    assert buyer.role == "buyer"
    assert seller.role == "seller"
    product1 = create_product(store=store)
    product2 = create_product(name="Another Product", store=store)

    # Add items to cart
    data1 = {"product_id": product1.id, "quantity": 2}
    data2 = {"product_id": product2.id, "quantity": 1}
    
    response = buyer_client.post("/cart/add/", data1)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Item added"
    
    response = buyer_client.post("/cart/add/", data2)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Item added"

    assert CartItem.objects.filter(cart__buyer=buyer, product=product1).exists()
    assert CartItem.objects.filter(cart__buyer=buyer, product=product2).exists()

    # Retrieve cart
    response = buyer_client.get(f"/cart/{store.id}/")
    assert response.status_code == status.HTTP_200_OK
    assert "items" in response.data
    assert len(response.data["items"]) == 2  

    # Remove a specific item (product1)
    cart_item = CartItem.objects.get(cart__buyer=buyer, product=product1)

    response = buyer_client.delete(f"/cart/item/{cart_item.id}/")
    assert response.status_code == status.HTTP_200_OK
    assert not CartItem.objects.filter(id=cart_item.id).exists()
    response = buyer_client.delete(f"/cart/clear/{store.id}/")
    assert response.status_code == status.HTTP_200_OK
    assert not CartItem.objects.filter(cart__buyer=seller, product__store=store).exists()
