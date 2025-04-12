from .models import Product, Category

def get_seller_categories(user):
    return Category.objects.filter(seller=user)

def create_category(user, data):
    return Category.objects.create(seller=user, **data)

def update_category(user, category_id, data):
    category = Category.objects.get(id=category_id, seller=user, is_deleted=False)
    for key, value in data.items():
        setattr(category, key, value)
    category.save()
    return category

def delete_category(user, category_id):
    category = Category.objects.get(id=category_id, seller=user)
    category.delete()

def delete_category(user, category_id):
    category = Category.objects.get(id=category_id, seller=user, is_deleted=False)  
    category.is_deleted = True  #soft deletion
    category.save()
    
    category.products.update(is_deleted=True)  