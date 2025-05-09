from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import CustomUser
from products.models import Product
from orders.models import Order, OrderItem
import json

class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com',
            sun_points=100
        )
        self.product1 = Product.objects.create(
            name='Product 1',
            description='Description 1',
            price=10.00,
            stock=5
        )
        self.product2 = Product.objects.create(
            name='Product 2',
            description='Description 2',
            price=20.00,
            stock=3
        )
        self.list_url = reverse('order-list')
        self.create_url = reverse('order-create')
        
        # Sample valid order data
        self.valid_order_data = {
            'shipping_name': 'John Doe',
            'email': 'john@example.com',
            'address': '123 Main St',
            'city': 'Anytown',
            'zip_code': '12345',
            'sun_points_used': 10,
            'items': [
                {
                    'product_id': self.product1.id,
                    'quantity': 2
                },
                {
                    'product_id': self.product2.id,
                    'quantity': 1
                }
            ]
        }

    def test_create_order_normal(self):
        """Test normal order creation"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            self.create_url,
            data=json.dumps(self.valid_order_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OrderItem.objects.count(), 2)
        self.assertEqual(self.user.sun_points, 90)  # 100 - 10 used

    def test_create_order_invalid_quantity(self):
        """Test order creation with invalid quantity"""
        self.client.force_authenticate(user=self.user)
        invalid_data = self.valid_order_data.copy()
        invalid_data['items'][0]['quantity'] = 'abc'  # Invalid quantity
        
        response = self.client.post(
            self.create_url,
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid product data', str(response.data))

    def test_create_order_sql_injection(self):
        """Test order creation with SQL injection attempt"""
        self.client.force_authenticate(user=self.user)
        sql_injection_data = self.valid_order_data.copy()
        sql_injection_data['shipping_name'] = "Robert'); DROP TABLE orders;--"
        
        response = self.client.post(
            self.create_url,
            data=json.dumps(sql_injection_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # Should be sanitized
        self.assertEqual(Order.objects.count(), 1)
        order = Order.objects.first()
        # The name should be properly escaped, not execute SQL
        self.assertIn("Robert", order.shipping_name)
        self.assertNotIn("DROP TABLE", order.shipping_name)

    def test_list_orders_normal(self):
        """Test normal order listing"""
        # Create an order first
        self.client.force_authenticate(user=self.user)
        self.client.post(
            self.create_url,
            data=json.dumps(self.valid_order_data),
            content_type='application/json'
        )
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['items'][0]['product']['name'], 'Product 1')

    def test_list_orders_unauthenticated(self):
        """Test order listing without authentication"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_orders_xss_attempt(self):
        """Test order listing with XSS attempt in product name"""
        xss_product = Product.objects.create(
            name='<script>alert(1)</script>',
            description='Description',
            price=10.00,
            stock=5
        )
        
        # Create order with XSS product
        self.client.force_authenticate(user=self.user)
        xss_order_data = self.valid_order_data.copy()
        xss_order_data['items'] = [{
            'product_id': xss_product.id,
            'quantity': 1
        }]
        self.client.post(
            self.create_url,
            data=json.dumps(xss_order_data),
            content_type='application/json'
        )
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensure the response is properly escaped
        self.assertNotIn('<script>', str(response.data))