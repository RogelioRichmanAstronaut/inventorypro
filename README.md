# InventoryPro: Basic Inventory Management System
## Introduction
Welcome to InventoryPro! Efficient billing system that also updates inventory stock after a sale. Additionally, it generates statistical sales reports. This simplified system includes product management, inventory control, and sales recording.
## Tech Stack
- **Backend:** Django, Django REST Framework
- **Frontend:** React
- **Database:** PostgreSQL
- **Authentication:** Auth0
- **Caching:** Redis
## Project Setup
### Backend (Django)
1. **Clone the Repository:**
    ```bash
    git clone https://github.com/RogelioRichmanAstronaut/inventorypro.git
    cd inventorypro
    cd inventory_management
    ```
2. **Set Up Virtual Environment:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```
3. **Install Dependencies:**
    ```bash
    pip install wheel
    pip install -r requirements.txt
    ```
4. **Run Redis Server:**
    Ensure Redis is installed and running. You can install Redis by following the instructions [here](https://redis.io/download).
    ```bash
    redis-server
    ```
5. **Open Another Terminal and run the development server.:**
    ```bash
    cd inventorypro
    cd inventory_management
    python manage.py runserver
    ```
6. **Credentials Superuser backend:**
 ```
    Superuser: username: danitest
    Email: danitest@test.com
    password: Dani123!
```

### Frontend (React)
1. **Open a New Terminal and Navigate to the Frontend Directory:**
    ```bash
    cd inventorypro
    cd frontend-react
    ```
2. **Install Dependencies:**
    ```bash
    npm install
    ```
3. **Run the Development Server:**
    ```bash
    npm run dev
    ```
6. **Credentials user Auth0 Frontend:**
 ```
    "username": "testuser",
    "password": "TestUser123!",
    "email": "testuser@test.com"
```

## Project Structure
### Backend Directory Structure
```plaintext
inventory_management/
├── api/
│   ├── management/
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   ├── sql/
│   ├── tests.py
├── inventory_management/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
├── manage.py
```
### Frontend Directory Structure
```plaintext
frontend/
├── src/
│   ├── App.tsx
│   ├── CreateProduct.tsx
│   ├── CreateReport.tsx
│   ├── EditProduct.tsx
│   ├── InventoryContext.tsx
│   ├── NewSale.tsx
│   ├── ReportDetails.tsx
│   ├── Reports.tsx
│   ├── Sales.tsx
│   ├── apiService.ts
│   ├── auth/
│   ├── main.tsx
│   ├── vite-env.d.ts
```
## Database Design (PostgreSQL)
Our database schema consists of the following main tables:
- **Product:** Stores product details.
- **ProductHistory:** Tracks product history.
- **ProductHistoryMovement:** Records product history movements.
- **Sale:** Records sales transactions.
- **SaleItem:** Associates products with sales.
- **User:** Stores user details.
- **Auth:** Manages authentication tokens.
- **SalesReport:** Stores sales report data.
- **SalesReportItem:** Contains items of sales reports.
<img src="https://github.com/user-attachments/assets/37ea68c3-0696-428f-b321-396bda2428b1" alt="Class Diagram" width="700"/>

## Backend (Django)
### RESTful API Development
- **API Endpoints:** We developed a RESTful API using Django REST Framework (DRF) for product management, sales, and inventory control.
- **Authentication:** Implemented token-based authentication using Auth0.
- **Inventory Control:** Managed inventory updates through stored procedures.
- **Sales Management:** Handled sales recording and inventory updates atomically.
- **Sales Reports:** Generated statistical reports using PostgreSQL functions.
### API Documentation
We used Swagger to document our API endpoints. You can access it at `/swagger/`. Example: `http://127.0.0.1:8000/swagger/`
- **Api documentation Swagger UI:**
  ![Inventory View](https://github.com/user-attachments/assets/55a05c3b-57be-4bba-beb1-5a88fc2ae7ac)

## Frontend (React)
### Componentization and State Management
- **Components:** We created reusable components for products, sales, and reports.
- **State Management:** Used React hooks to manage state efficiently.
### Routes and Navigation
Implemented routing using React Router for seamless navigation between different views.
### User Interface
Screenshots of the frontend UI:
- **Inventory View:**
  ![Inventory View](https://github.com/user-attachments/assets/55c7250b-5fd8-475f-9dc5-233a1a632fc2)

- **Product History Movements:**
  ![Product History Movements](https://github.com/user-attachments/assets/3e56232a-7006-4c6b-ad54-14492da3582f)
  
- **Sales View:**
  ![Sales View](https://github.com/user-attachments/assets/abd1b9c1-d79c-4761-b995-75c688ad4bc8)

- **Sale Details:**
  ![Sale Details](https://github.com/user-attachments/assets/5c0e4dcc-70d7-43bb-ab74-931364946cd1)

- **Create Product:**
  ![Create Product](https://github.com/user-attachments/assets/25e69444-6bae-4e9e-b328-282eda631290)

- **Report Details:**
  ![Report Details](https://github.com/user-attachments/assets/531447d2-ba62-40e1-87e9-42de5d73d54a)

## Transaction Management
We ensured atomicity in critical operations like inventory updates using Django transactions and PostgreSQL stored procedures.
## Performance and Scalability
- **Query Optimization:** Optimized queries for large-scale operations.
- **Cache Implementation:** Used Redis for caching to improve response times.
- **Scalability:** Designed with horizontal scalability in mind.
## Running the Project
### Using Provided Environment Variables
If you want to use the provided environment variables, simply follow the steps mentioned in the Project Setup section.

### Using Custom Environment Variables
1. **Update Database Credentials:**
    Modify the `DATABASES` setting in `inventory_management/settings.py`.
2. **Configure Auth0:**
    Update the Auth0-related settings in `inventory_management/settings.py`:
    ```python
    AUTH0_DOMAIN = 'your-auth0-domain'
    API_IDENTIFIER = 'your-api-identifier'
    CLIENT_ID = 'your-client-id'
    CLIENT_SECRET = 'your-client-secret'
    JWT_ISSUER = f'https://{AUTH0_DOMAIN}/'
    ```
# Conclusion
This project provides a comprehensive solution for basic inventory management, including product management, inventory control, and sales recording. It ensures robust transaction management and generates valuable sales reports. We hope this system meets your needs and enhances your e-commerce operations. If you have any questions or need further assistance, feel free to reach out!

**Utility:**
- **Developers:** Can use it as a template for building their own inventory management systems.
- **Businesses:** Can adapt it for managing their inventory, sales, and generating reports.
- **Educational Purpose:** Useful for learning how to integrate Django with PostgreSQL, implement RESTful APIs, and build React frontends with Auth0 authentication.

Thank you for using the inventorypro. We hope it simplifies your inventory and sales management tasks. Feel free to explore and contribute to the project.

## License
This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.

---
For more detailed information, please refer to the project documentation or contact the project maintainers.

[![GitHub](https://img.shields.io/badge/GitHub-RogelioRichmanAstronaut-181717?logo=github)](https://github.com/RogelioRichmanAstronaut)

*Developed by Daniel Sandoval.* 
