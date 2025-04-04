import pytest
from rest_framework.test import APIClient
from products.models import Store, Category, Product
from django.contrib.auth import get_user_model
User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(username='seller1', email='seller1@example.com', password='testpass123')


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def store(user):
    return Store.objects.create(name='Test Store', seller=user)

@pytest.fixture
def category(store):
    return Category.objects.create(name='Snacks', store=store)

@pytest.fixture
def product(store, category):
    return Product.objects.create(name='Chips', price=10.0, store=store, category=category)


def test_public_category_list_view(api_client, store, category):
    url = f'/products/public/categories/{store.id}/'
    response = api_client.get(url)
    assert response.status_code == 200
    assert any(cat['id'] == category.id for cat in response.data)

def test_public_product_list_view(api_client, store, category, product):
    url = f'/products/public/products/{store.id}/{category.id}/'
    response = api_client.get(url)
    assert response.status_code == 200
    assert any(prod['id'] == product.id for prod in response.data)

# Authenticated Views
def test_product_list_create_view(auth_client, store, category):
    response = auth_client.get('/products/products/')
    assert response.status_code == 200

    data = {
        'name': 'Cookie',
        'price': 15.5,
        'store': store.id,
        'category': category.id
    }
    response = auth_client.post('/products/products/', data)
    assert response.status_code == 201
    assert response.data['name'] == 'Cookie'

def test_product_detail_view(auth_client, product):
    url = f'/products/products/{product.id}/'
    
    response = auth_client.get(url)
    assert response.status_code == 200

    response = auth_client.put(url, {'name': 'Updated Chips', 'price': 12.0, 'store': product.store.id, 'category': product.category.id})
    assert response.status_code == 200
    assert response.data['name'] == 'Updated Chips'

    response = auth_client.delete(url)
    assert response.status_code == 204

def test_category_list_create_view(auth_client, store):
    response = auth_client.get('/products/categories/')
    assert response.status_code == 200
    data = {'name': 'Beverages', 'store': store.id}
    response = auth_client.post('/products/categories/', data)
    assert response.status_code == 201
    assert response.data['name'] == 'Beverages'

def test_category_detail_view(auth_client, category):
    url = f'/products/categories/{category.id}/'
    response = auth_client.get(url)
    assert response.status_code == 200

    response = auth_client.put(url, {'name': 'Updated Category', 'store': category.store.id})
    assert response.status_code == 200
    assert response.data['name'] == 'Updated Category'
    response = auth_client.delete(url)
    assert response.status_code == 204
