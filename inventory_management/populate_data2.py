import requests

# Bearer Token
TOKEN = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkhWZ0ExeFpDZG1qM1ltN2JlaDE5VSJ9.eyJpc3MiOiJodHRwczovL2Rldi1reGpzZGsxYzR0aGEza3BnLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJ3VFU4YW9XQkJaaFZ5dlZUUFJMRnpEOWtXOVE0YTduQ0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYta3hqc2RrMWM0dGhhM2twZy51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTcyMjQ1MzY0OSwiZXhwIjoxNzIyNTQwMDQ5LCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoid1RVOGFvV0JCWmhWeXZWVFBSTEZ6RDlrVzlRNGE3bkMifQ.eYoWLKOT_JKqrZt_ycpm0V3FHWM60cF9fs_7RwtqbcQVRNunqvRbsR5LrRdGLRV92hhbKhm6jd6XSCI-KPqFYrkJ7eEjcCTWRgnnNE6hRVXdc-BF4nekC_l6OA-RVZk3ErLXYAXaW6I8IRFauCfK_9g0TSwwz4CcRcgIMniPjwoyaR9G0ZS5OtebMJKOi9euBKcj9QKqrsSzoUZm00MFsUdaS9g_qowTKhfZYsFNMIdkRFXaw2uaOLts1yH5tMmog_aaA0l14PZaKRe3tjLDg5K0ZuR65AzWjctmDyRdcU9iyX_Goxqd16RI2LGkLjm6WRWwFfXzLMbKeCyHgn__rw'

# Headers
headers = {
    'Authorization': TOKEN,
    'Content-Type': 'application/json'
}

# URL
base_url = 'http://127.0.0.1:8000/api/'

# Function to create data
def create_data(endpoint, data):
    response = requests.post(base_url + endpoint, json=data, headers=headers)
    if response.status_code == 201:
        print(f"Successfully created {endpoint[:-1]}: {response.json()}")
    else:
        print(f"Failed to create {endpoint[:-1]}: {response.text}")

# # Create Products
# products = [
#     {"name": "Product 1", "description": "Description 1", "price": 10.0, "balance": 100},
#     {"name": "Product 2", "description": "Description 2", "price": 20.0, "balance": 200},
#     {"name": "Product 3", "description": "Description 3", "price": 30.0, "balance": 300},
#     {"name": "Product 4", "description": "Description 4", "price": 40.0, "balance": 400},
#     {"name": "Product 5", "description": "Description 5", "price": 50.0, "balance": 500},
#     {"name": "Product 6", "description": "Description 6", "price": 60.0, "balance": 600},
#     {"name": "Product 7", "description": "Description 7", "price": 70.0, "balance": 700},
#     {"name": "Product 8", "description": "Description 8", "price": 80.0, "balance": 800},
#     {"name": "Product 9", "description": "Description 9", "price": 90.0, "balance": 900},
#     {"name": "Product 10", "description": "Description 10", "price": 100.0, "balance": 1000}
# ]
# for product in products:
#     create_data('products/', product)


# Create Sales with Items
sales = [
    {"total_amount": 100.0, "user_id": 1, "items": [
        {"product_id": 11, "quantity": 5, "total_amount": 50.0},
        {"product_id": 12, "quantity": 3, "total_amount": 60.0}
    ]},
    {"total_amount": 150.0, "user_id": 1, "items": [
        {"product_id": 13, "quantity": 2, "total_amount": 60.0},
        {"product_id": 14, "quantity": 4, "total_amount": 80.0}
    ]}
]

for sale in sales:
    create_data('sales/', sale)