import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Store

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
def authenticated_client(api_client, create_user):
    user = create_user()
    api_client.force_authenticate(user=user)
    return api_client, user

@pytest.fixture
def authenticated_buyer_client(db):
    buyer = User.objects.create_user(
        username="buyer_user",
        email="buyer@example.com",
        password="testpassword",
        role="buyer"  
    )
    
    client = APIClient()
    client.force_authenticate(user=buyer)  
    
    return client, buyer  

@pytest.fixture
def create_store(db, create_user):
    def make_store(name="Test Store", description="Sample", location="City", status="open", seller=None):
        if not seller:
            seller = create_user()
        return Store.objects.create(name=name, description=description, location=location, status=status, seller=seller)
    return make_store

@pytest.mark.django_db
def test_create_store(authenticated_client, authenticated_buyer_client):
    """ Ensure authenticated sellers can create a store, but only one store per seller """
    client, user = authenticated_client
    buyer_client, _ = authenticated_buyer_client 
    data = {
        "name": "Test Store 1",
        "description": "A store for testing",
        "location": "Test Location",
        "status": "open"
    }

    # First store creation should succeed
    response = client.post("/stores/create/", data)
    assert response.status_code == status.HTTP_201_CREATED
    assert Store.objects.filter(seller=user).exists()

    # Second store creation should fail
    data["name"] = "Test Store 2"
    response = client.post("/stores/create/", data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "You can only have one store." in response.data
    
    # Test with a buyer client
    data["name"] = "Test Store 3"
    response = buyer_client.post("/stores/create/", data)
    assert response.status_code == status.HTTP_403_FORBIDDEN  
    assert response.data["detail"] == "Only sellers can create a store."

@pytest.mark.django_db
def test_list_stores(api_client, create_store):
    """ Ensure the store listing API returns all stores """
    create_store(name="Store 1")
    create_store(name="Store 2")

    response = api_client.get("/stores/")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2  # Two stores should be listed

@pytest.mark.django_db
def test_get_store_details(authenticated_client, create_store):
    """ Ensure store details can be retrieved """
    client, user = authenticated_client  
    store = create_store(name="Test Store", seller=user)

    response = client.get(f"/stores/{store.id}/")
    
    assert response.status_code == status.HTTP_200_OK  # Now it should pass
    assert response.data["name"] == "Test Store"


@pytest.mark.django_db
def test_update_store(authenticated_client, create_store):
    """ Ensure only the store owner can update their store """
    client, user = authenticated_client
    store = create_store(name="Old Store", seller=user)

    data = {
        "name": "Updated Store",
        "description": "Updated description",
        "location": "Updated Location",  
        "status": "open"
    }

    response = client.put(f"/stores/{store.id}/", data)

    assert response.status_code == status.HTTP_200_OK
    store.refresh_from_db()
    assert store.name == "Updated Store"

@pytest.mark.django_db
def test_update_store_unauthorized(api_client, create_store, create_user):
    """ Ensure unauthorized users cannot update a store """
    store = create_store(name="Owner's Store")
    other_user = create_user(email="other@example.com", username="otheruser", password="password123")
    
    api_client.force_authenticate(user=other_user)
    data = {"name": "Hacked Store"}
    response = api_client.put(f"/stores/{store.id}/", data)

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Unauthorized or not found" in response.data["error"]

@pytest.mark.django_db
def test_delete_store(authenticated_client, create_store):
    """ Ensure only the store owner can delete their store """
    client, user = authenticated_client
    store = create_store(name="Store to Delete", seller=user)

    response = client.delete(f"/stores/{store.id}/")
    assert response.status_code == status.HTTP_200_OK
    assert not Store.objects.filter(id=store.id).exists()

@pytest.mark.django_db
def test_delete_store_unauthorized(api_client, create_store, create_user):
    """ Ensure unauthorized users cannot delete a store """
    store = create_store(name="Owner's Store")
    other_user = create_user(email="other@example.com", username="otheruser", password="password123")

    api_client.force_authenticate(user=other_user)
    response = api_client.delete(f"/stores/{store.id}/")

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Unauthorized or not found" in response.data["error"]
