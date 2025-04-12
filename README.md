Backend Setup (Django + DRF)

1. Clone the repo and navigate to the backend folder:
   cd campus_craves_backend/
2. Create a virtual environment:
   python -m venv venv
3. Activate the virtual environment:
   - On macOS/Linux:
     source venv/bin/activate
   - On Windows:
     venv\Scripts\activate
4. Install dependencies:
   pip install -r requirements.txt
5. Run the server:
   python manage.py runserver

------------------------------------

Frontend Setup (React)

1. Navigate to the frontend directory:
   cd campus_craves_frontend/
2. Install dependencies:
   npm install
3. Run the frontend app:
   npm run dev

------------------------------------

Test Users

You can use the following user credentials to log in during testing:

| Email                 | Username | Password     | Role   |
|-----------------------|----------|--------------|--------|
| buyer1@example.com    | buyer1   | buyer_one    | Buyer  |
| seller1@example.com   | seller1  | seller_one   | Seller |
| buyer2@example.com    | buyer2   | buyer_two    | Buyer  |
| seller2@example.com   | seller2  | seller_two   | Seller |
| buyer3@example.com    | buyer3   | buyer_three  | Buyer  |
| seller3@example.com   | seller3  | seller_three | Seller |

-------------------------------------

Environment Variables (.env)

There is a `.env` file inside the `campus_craves_backend/` folder that holds null value API keys for development and testing.
Please replace it with the .env file shared by the development team.

--------------------------------------

Use http://localhost:8000 for the backend and http://localhost:5173 for the frontend.


              
