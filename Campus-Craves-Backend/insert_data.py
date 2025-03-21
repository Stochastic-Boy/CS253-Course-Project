import sqlite3

# Connect to the SQLite database (adjust path if needed)
conn = sqlite3.connect("db.sqlite3")
cursor = conn.cursor()

# 1️⃣ Insert User (Buyer, Seller, Admin)
cursor.execute("INSERT INTO users_"
"user (email, username, password, role, is_active, is_staff, is_superuser) VALUES (?, ?, ?, ?, ?, ?, ?)",
               ("buyer@example.com", "buyer123", "pbkdf2_sha256$870000$eMYkMpBagwcET3rymuelOZ$ur1X97zvGeEDt34XleWYvZABi0uutxdwNEeQJ8+KxTw=", "buyer", True, False, False))
cursor.execute("INSERT INTO users_user (email, username, password, role, is_active, is_staff, is_superuser) VALUES (?, ?, ?, ?, ?, ?, ?)",
               ("seller@example.com", "seller123", "pbkdf2_sha256$870000$kqGM1hQ9NtgVuILl1bfj17$1yeyMiigUhONjORQLKE85y8lrKVpNqTWOgDEenV88rw=", "seller", True, False, False))
cursor.execute("INSERT INTO users_user (email, username, password, role, is_active, is_staff, is_superuser) VALUES (?, ?, ?, ?, ?, ?, ?)",
               ("admin@example.com", "admin123", "pbkdf2_sha256$870000$gno4iaicnSIbEPNQf5uzvc$s62WVM138p0ZphlWFFpoGlEtjijCLSciZcA6f5p8eB4=", "admin", True, True, True))

# Buyer : email = buyer@example.com; password = buyer_password
# Seller : email = seller@example.com; password = seller_password
# Admin : email = admin@example.com; password = admin_password

# 2️⃣ Insert Buyer & Seller Profiles
cursor.execute("INSERT INTO users_buyerprofile (user_id, phone_number, address) VALUES (?, ?, ?)", (2, "9876543210", "D520, Hall 5"))
cursor.execute("INSERT INTO users_sellerprofile (user_id, business_name, contact_number, location) VALUES (?, ?, ?, ?)",
               (3, "Hall 8", "1234567890", "In front of OAT"))

# 3️⃣ Insert a Store
cursor.execute("""
    INSERT INTO stores_store (name, description, location, status, seller_id, created_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
""", ("Hall 8", "Best Snacks available", "In front of OAT", "active", 3))


# 4️⃣ Insert a Category & Product
cursor.execute("INSERT INTO products_category (name, created_by_id) VALUES (?, ?)", ("Snacks", 3))
cursor.execute("""
    INSERT INTO products_product (name, description, category_id, price, store_id, stock, created_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
""", ("Panner Roll", "Tasty", 1, 90.00, 1, 10))

cursor.execute("""
    INSERT INTO products_product (name, description, category_id, price, store_id, stock, created_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
""", ("Chicken Roll", "Very Tasty", 1, 120.00, 1, 15))

# Commit and close
conn.commit()
conn.close()

print("✅ Data inserted successfully into SQLite3!")
