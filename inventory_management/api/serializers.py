from rest_framework import serializers
from .models import Product, ProductHistory, SalesReportItem, ProductHistoryMovement, Sale, SaleItem, User, Auth, SalesReport
from django.db import transaction, connection

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        product = Product.objects.create(**validated_data)
        if product.balance > 0:
            product.create_initial_history()
        return product


class ProductHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductHistory
        fields = '__all__'

class ProductHistoryMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductHistoryMovement
        fields = '__all__'

class SaleItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    class Meta:
        model = SaleItem
        fields = ['id', 'sale_id', 'product_id', 'quantity', 'total_amount']

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
    user_id = serializers.IntegerField(write_only=True)  # Explicitly define user_id

    class Meta:
        model = Sale
        fields = ['id', 'date', 'total_amount', 'user_id', 'items']

    def create(self, validated_data):
        print("Validated data:", validated_data)  # Debugging line to print validated_data
        with transaction.atomic():
            items_data = validated_data.pop('items')
            user_id = validated_data.pop('user_id')  # Extract user_id from validated_data
            sale = Sale.objects.create(user_id=user_id, **validated_data)  # Pass user_id explicitly
            
            for item_data in items_data:
                product = Product.objects.get(id=item_data['product_id'])
                SaleItem.objects.create(sale=sale, product=product, **item_data)
                
                # Record the ProductHistoryMovement
                product_history = ProductHistory.objects.get(product=product)
                ProductHistoryMovement.objects.create(
                    product_history=product_history,
                    quantity=item_data['quantity'],
                    type='sale',
                    sale=sale
                )
            
            # Call the update_inventory stored procedure
            with connection.cursor() as cursor:
                cursor.callproc('update_inventory', [sale.id])
            
            return sale
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class AuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auth
        fields = '__all__'

class SalesReportItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesReportItem
        fields = ['product_name', 'total_quantity', 'total_amount', 'percentage']

class SalesReportSerializer(serializers.ModelSerializer):
    items = SalesReportItemSerializer(many=True, read_only=True)

    class Meta:
        model = SalesReport
        fields = ['id', 'start_date', 'end_date', 'report_type', 'total_amount', 'created_at', 'updated_at', 'items']