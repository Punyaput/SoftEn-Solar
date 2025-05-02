# orders/tests.py
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()

class OrderTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            sun_points=100
        )
        self.product = Product.objects.create(
            name='Test Product',
            price=10.00,
            stock=10
        )
        self.client.force_authenticate(user=self.user)
        
        self.valid_payload = {
            "shipping_name": "Test User",
            "email": "test@example.com",
            "address": "123 Test St",
            "city": "Testville",
            "zip_code": "12345",
            "items": [
                {
                    "product": {
                        "id": self.product.id,
                        "name": self.product.name,
                        "price": str(self.product.price)
                    },
                    "quantity": 2
                }
            ],
            "sun_points_used": 10
        }

    def test_create_order(self):
        url = reverse('order-create')
        response = self.client.post(url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.user.sun_points, 90)  # 100 - 10 used
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 8)  # 10 - 2 ordered