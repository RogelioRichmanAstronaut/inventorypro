import requests
from django.conf import settings
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.db import connection
from django.db.models import Sum
from django.core.cache import cache
from django.utils import timezone
from datetime import datetime
from .models import Product , Sale, SaleItem, User, Auth, SalesReport,SalesReportItem,  ProductHistory, ProductHistoryMovement
from .serializers import ProductSerializer, SaleSerializer, SaleItemSerializer, UserSerializer, AuthSerializer, SalesReportSerializer, ProductHistorySerializer, ProductHistoryMovementSerializer


class UpdateInventoryView(APIView):
    def post(self, request, sale_id):
        with connection.cursor() as cursor:
            cursor.callproc('update_inventory', [sale_id])
        return Response({"message": "Inventory updated successfully"}, status=status.HTTP_200_OK)
    
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def retrieve(self, request, *args, **kwargs):
        product_id = kwargs.get('pk')
        cache_key = f"product_{product_id}"
        product = cache.get(cache_key)
        
        if not product:
            product = super().retrieve(request, *args, **kwargs)
            cache.set(cache_key, product.data, timeout=60*15)  # Cache for 15 minutes
        else:
            product = Response(product)

        return product

    def perform_update(self, serializer):
        product = serializer.save()
        cache_key = f"product_{product.id}"
        cache.set(cache_key, ProductSerializer(product).data, timeout=60*15)  # Update cache after saving

    def perform_destroy(self, instance):
        cache_key = f"product_{instance.id}"
        cache.delete(cache_key)  # Invalidate cache after deletion
        instance.delete()

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    # permission_classes = [IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save()  # Inventory update handled in the serializer

class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer
    # permission_classes = [IsAuthenticated]

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [AllowAny]
            # self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        # Check if the username already exists in Django
        if User.objects.filter(username=request.data['username']).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # crear el usuario en Auth0
        auth0_response = self.create_user_in_auth0(request.data)
        if auth0_response.status_code != 201:
            return Response(auth0_response.json(), status=auth0_response.status_code)

        # Si la creación en Auth0 fue exitosa, crea el usuario en Django
        response = super().create(request, *args, **kwargs)
        return response

    def create_user_in_auth0(self, user_data):
        url = f'https://{settings.AUTH0_DOMAIN}/api/v2/users'
        headers = {
            'content-type': 'application/json',
            'Authorization': f'Bearer {self.get_auth0_token()}'
        }
        payload = {
            'email': user_data['email'],
            # 'username': user_data['username'],
            'password': user_data['password'],
            'connection': 'Username-Password-Authentication'
        }
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code != 201:
            print(f"Failed to create user in Auth0: {response.json()}")
        return response

    def get_auth0_token(self):
        url = f'https://{settings.AUTH0_DOMAIN}/oauth/token'
        headers = {'content-type': 'application/json'}
        payload = {
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'audience': f'https://{settings.AUTH0_DOMAIN}/api/v2/',
            'grant_type': 'client_credentials'
        }
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            print(f"Failed to get access token from Auth0: {response.json()}")
            raise Exception("Failed to get access token from Auth0")
        return response.json().get('access_token')

class AuthViewSet(viewsets.ModelViewSet):
    queryset = Auth.objects.all()
    serializer_class = AuthSerializer
    # permission_classes = [IsAuthenticated]

class SalesReportView(APIView):
    def post(self, request):
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        start_date = timezone.make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
        end_date = timezone.make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM generate_sales_report(%s, %s)", [start_date, end_date])
            result = cursor.fetchall()

        total_amount = sum(row[2] for row in result)
        
        # Save the report to the database
        sales_report = SalesReport.objects.create(
            start_date=start_date,
            end_date=end_date,
            report_type='Generated Report',
            total_amount=total_amount
        )

        # Save each item in the report
        for row in result:
            SalesReportItem.objects.create(
                sales_report=sales_report,
                product_name=row[0],
                total_quantity=row[1],
                total_amount=row[2],
                percentage=row[3]
            )

        serializer = SalesReportSerializer(sales_report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SalesReportDetailView(APIView):
    def get(self, request, pk):
        try:
            sales_report = SalesReport.objects.get(pk=pk)
        except SalesReport.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SalesReportSerializer(sales_report)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SalesReportViewSet(viewsets.ModelViewSet):
    queryset = SalesReport.objects.all()
    serializer_class = SalesReportSerializer
    # permission_classes = [IsAuthenticated]
    
class ProductHistoryViewSet(viewsets.ModelViewSet):
    queryset = ProductHistory.objects.all()
    serializer_class = ProductHistorySerializer
    # permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        product_id = kwargs.get('pk')
        product_history = ProductHistory.objects.filter(product_id=product_id).first()
        if not product_history:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        movements = ProductHistoryMovement.objects.filter(product_history=product_history)
        serializer = ProductHistoryMovementSerializer(movements, many=True)
        return Response(serializer.data)

class ProductHistoryMovementViewSet(viewsets.ModelViewSet):
    queryset = ProductHistoryMovement.objects.all()
    serializer_class = ProductHistoryMovementSerializer
    # permission_classes = [IsAuthenticated]