from django.test import TestCase
from django.db import connection
from .models import Product
from rest_framework.test import APIClient, APITestCase

class ProductModelTest(TestCase):
    def setUp(self):
        Product.objects.create(name="Test Product", description="Test Description", price=10.0)

    def test_product_creation(self):
        product = Product.objects.get(name="Test Product")
        self.assertEqual(product.description, "Test Description")

class ProductAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.product = Product.objects.create(name="Test Product", description="Test Description", price=10.0)

    def test_get_products(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

# class StoredProceduresTest(TestCase):
#     def test_update_inventory(self):
#         with connection.cursor() as cursor:
#             cursor.callproc('update_inventory', [1])
#         # Add assertions to verify inventory updates
#         # inventory = Inventory.objects.get(product_id=1)
#         # self.assertEqual(inventory.quantity, 0)
#     def test_generate_sales_report(self):
#         with connection.cursor() as cursor:
#             cursor.callproc('generate_sales_report', ['2023-01-01', '2023-12-31'])
#             report = cursor.fetchall()
#         # Add assertions to verify the report contents
