from django.core.exceptions import ObjectDoesNotExist
from .models import Store

def create_store(seller, name, description, location, status):
    return Store.objects.create(
        seller=seller,
        name=name,
        description=description,
        location=location,
        status=status
    )

def get_all_stores():
    return Store.objects.all()

def get_store_by_id(store_id):
    try:
        return Store.objects.get(id=store_id)
    except ObjectDoesNotExist:
        return None

def update_store(store, name, description, location, status):
    store.name = name
    store.description = description
    store.location = location
    store.status = status
    store.save()
    return store

def delete_store(store):
    store.delete()