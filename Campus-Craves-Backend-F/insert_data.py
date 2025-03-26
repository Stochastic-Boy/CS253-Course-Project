import sqlite3
import django
from django.conf import settings
from django.contrib.auth.hashers import make_password

settings.configure(
    PASSWORD_HASHERS=[
        "django.contrib.auth.hashers.PBKDF2PasswordHasher",
        "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
        "django.contrib.auth.hashers.Argon2PasswordHasher",
        "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    ]
)
django.setup()

conn = sqlite3.connect("db.sqlite3")
cursor = conn.cursor()

users = [
    ("admin@example.com", "admin", "admin_password", "admin", True, True, True),
    ("buyer@example.com", "buyer1", "buyer_password", "buyer", True, False, False),
    ("seller@example.com", "seller1", "seller_password", "seller", True, False, False),
    ("buyertwo@example.com", "buyer2", "buyer_two", "buyer", True, False, False),
    ("sellertwo@example.com", "seller2", "seller_two", "seller", True, False, False),
    ("buyerthree@example.com", "buyer3", "buyer_two", "buyer", True, False, False),
    ("sellerthree@example.com", "seller3", "seller_three", "seller", True, False, False),
]

for email, username, password, role, is_active, is_staff, is_superuser in users:
    hashed_password = make_password(password)
    cursor.execute(
        "INSERT INTO users_user (email, username, password, role, is_active, is_staff, is_superuser) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (email, username, hashed_password, role, is_active, is_staff, is_superuser),
    )

buyer_profiles = [
    ('1234567890', 'D520, Hall 6', 2),
    ('2345678901', 'C311, Hall 12', 4),
    ('3456789012', 'D105, Hall 9', 6),
]

for phone, address, user_id in buyer_profiles:
    cursor.execute(
        "INSERT INTO users_buyerprofile (phone_number, address, user_id) VALUES (?, ?, ?)",
        (phone, address, user_id),
    )

seller_profiles = [
    ('Hall 1 Canteen', '1112223333', 'Hall 1, IIT Kanpur', 3),
    ('Hall 2 Canteen', '2223334444', 'Hall 2, IIT Kanpur', 5),
    ('Hall 3 Canteen', '3334445555', 'Hall 3, IIT Kanpur', 7),
]

for business_name, contact_number, location, user_id in seller_profiles:
    cursor.execute(
        "INSERT INTO users_sellerprofile (business_name, contact_number, location, user_id) VALUES (?, ?, ?, ?)",
        (business_name, contact_number, location, user_id),
    )

conn.commit()

seller_ids = [3, 5, 7]  
store_names = ["Hall 1", "Hall 2", "Hall 3"]
store_ids = []

for i, seller_id in enumerate(seller_ids):
    store_name = store_names[i]
    cursor.execute(
        "INSERT INTO stores_store (name, description, location, status, seller_id) VALUES (?, ?, ?, ?, ?)",
        (store_name, f"Description for {store_name}", "Some Location", "open", seller_id),
    )
    store_ids.append(cursor.lastrowid)

conn.commit()

food_categories = [
    "Bakery", "Beverages",
    "Snacks", "Fast Food",
    "Desserts", "Breakfast Items",
]

category_ids = []

for i, store_id in enumerate(store_ids):
    category1, category2 = food_categories[i * 2], food_categories[i * 2 + 1]
    
    for category_name in [category1, category2]:
        cursor.execute(
            "INSERT INTO products_category (name, store_id) VALUES (?, ?)",
            (category_name, store_id),
        )
        category_ids.append(cursor.lastrowid)

conn.commit()

food_products = {
    "Bakery": [("Croissant", "Flaky, buttery pastry.", 40.0), ("Muffin", "Soft and sweet muffin.", 50.0)],
    "Beverages": [("Cappuccino", "Rich espresso with steamed milk.", 80.0), ("Iced Tea", "Chilled, refreshing tea.", 60.0)],
    "Snacks": [("Chips", "Crispy potato chips.", 30.0), ("Nachos", "Spicy, cheesy nachos.", 70.0)],
    "Fast Food": [("Burger", "Juicy grilled beef burger.", 120.0), ("French Fries", "Golden, crispy fries.", 50.0)],
    "Desserts": [("Ice Cream", "Creamy vanilla ice cream.", 90.0), ("Brownie", "Rich, chocolate brownie.", 70.0)],
    "Breakfast Items": [("Pancakes", "Fluffy pancakes with syrup.", 100.0), ("Omelette", "Cheesy, veggie omelette.", 80.0)],
}

for i, category_id in enumerate(category_ids):
    category_name = food_categories[i]  
    for product_name, product_desc, product_price in food_products[category_name]:
        cursor.execute(
            "INSERT INTO products_product (name, description, price, category_id, store_id) VALUES (?, ?, ?, ?, ?)",
            (product_name, product_desc, product_price, category_id, store_ids[i // 2]),
        )

conn.commit()
conn.close()

print("Users, stores, categories, and products inserted successfully into SQLite3!")
