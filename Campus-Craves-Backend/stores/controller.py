# stores/controller.py
from django.core.exceptions import ObjectDoesNotExist
from .models import Store

def create_store(seller, name, description, location, status):
    """Create a new store for a seller."""
    return Store.objects.create(seller=seller, name=name, description=description, location=location, status=status)

def get_all_stores():
    """Retrieve all stores."""
    return Store.objects.all()

def get_store_by_id(store_id):
    """Retrieve a store by its ID."""
    try:
        return Store.objects.get(id=store_id)
    except ObjectDoesNotExist:
        return None

def update_store(store, name, description, location, status):
    """Update store details."""
    store.name = name
    store.description = description
    store.location = location
    store.status = status
    store.save()
    return store

def delete_store(store):
    """Delete a store."""
    store.delete()