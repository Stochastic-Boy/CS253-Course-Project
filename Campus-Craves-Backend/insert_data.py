import sqlite3
import django
from django.conf import settings
from django.contrib.auth.hashers import make_password

# Manually configure Django settings
settings.configure(
    PASSWORD_HASHERS=[
        "django.contrib.auth.hashers.PBKDF2PasswordHasher",
        "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
        "django.contrib.auth.hashers.Argon2PasswordHasher",
        "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    ]
)
django.setup()

# Connect to SQLite
conn = sqlite3.connect("db.sqlite3")
cursor = conn.cursor()

# User data
users = [
    ("admin@example.com", "admin123", "admin_password", "admin", True, True, True),
    ("buyer@example.com", "buyer123", "buyer_password", "buyer", True, False, False),
    ("seller@example.com", "seller123", "seller_password", "seller", True, False, False),
    ("buyertwo@example.com", "buyertwo", "buyer_two", "buyer", True, False, False),
    ("sellertwo@example.com", "sellertwo", "seller_two", "seller", True, False, False),
    ("sellerthree@example.com", "sellerthree", "seller_three", "seller", True, False, False),
]

# Insert users into the database
for email, username, password, role, is_active, is_staff, is_superuser in users:
    hashed_password = make_password(password)
    cursor.execute(
        "INSERT INTO users_user (email, username, password, role, is_active, is_staff, is_superuser) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (email, username, hashed_password, role, is_active, is_staff, is_superuser),
    )

# Commit and close
conn.commit()
conn.close()

print("✅ Data inserted successfully into SQLite3!")

# sqlite> INSERT INTO stores_store (name, description, location, status, seller_id) 
#..> VALUES ('Store Name', 'This is a sample store description.', 'Some Location', 'open', 3);