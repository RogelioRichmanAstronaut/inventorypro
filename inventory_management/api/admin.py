from django.contrib import admin
from .models import Product, ProductHistory, ProductHistoryMovement, Sale, SaleItem, User, Auth, SalesReport, SalesReportItem

admin.site.register(Product)
admin.site.register(ProductHistory)
admin.site.register(ProductHistoryMovement)
admin.site.register(Sale)
admin.site.register(SaleItem)
admin.site.register(User)
admin.site.register(Auth)
admin.site.register(SalesReport)
admin.site.register(SalesReportItem)