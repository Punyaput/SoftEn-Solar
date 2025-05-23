# orders/urls.py
from django.urls import path
from .views import OrderCreateView, OrderListView, OrderDetailView

urlpatterns = [
    path('', OrderCreateView.as_view(), name='order-create'),
    path('history/', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]