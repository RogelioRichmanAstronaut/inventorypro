from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.FloatField()
    balance = models.IntegerField(default=0) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if the product is being created
        super().save(*args, **kwargs)
        if is_new and self.balance > 0:
            self.create_initial_history()

    def create_initial_history(self):
        if not ProductHistory.objects.filter(product=self).exists():
            product_history = ProductHistory.objects.create(product=self)
            ProductHistoryMovement.objects.create(
                product_history=product_history,
                quantity=self.balance,
                type='initial',
                sale=None
            )

class ProductHistory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProductHistoryMovement(models.Model):
    product_history = models.ForeignKey(ProductHistory, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    type = models.CharField(max_length=255)
    sale = models.ForeignKey('Sale', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Sale(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    total_amount = models.FloatField()
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_amount = models.FloatField(default=0) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class User(models.Model):
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Auth(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    expiry = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SalesReport(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    report_type = models.CharField(max_length=255)
    total_amount = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SalesReportItem(models.Model):
    sales_report = models.ForeignKey(SalesReport, related_name='items', on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)
    total_quantity = models.IntegerField()
    total_amount = models.FloatField()
    percentage = models.FloatField()