from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, SaleViewSet, SaleItemViewSet, 
    UserViewSet, AuthViewSet, SalesReportView ,SalesReportDetailView,  SalesReportViewSet,ProductHistoryViewSet,ProductHistoryMovementViewSet, UpdateInventoryView, 
)
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'sales', SaleViewSet)
router.register(r'saleitems', SaleItemViewSet)
router.register(r'users', UserViewSet)
router.register(r'auths', AuthViewSet)
router.register(r'salesreports', SalesReportViewSet)
router.register(r'producthistories', ProductHistoryViewSet)
router.register(r'producthistorymovements', ProductHistoryMovementViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="Inventory Management API by Daniel Sandoval",
        default_version='v1',
        description="API documentation for the Inventory Management System",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/update_inventory/<int:sale_id>/', UpdateInventoryView.as_view(), name='update_inventory'),
    path('api/products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='product-detail'),
    # path('api/sales_report/', SalesReportView.as_view(), name='sales_report'),
    # path('api/sales_report/<int:pk>/', SalesReportView.as_view(), name='sales_report_detail'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/sales_report/', SalesReportView.as_view(), name='sales_report'),
    path('api/salesreports/<int:pk>/', SalesReportDetailView.as_view(), name='sales_report_detail'),
]