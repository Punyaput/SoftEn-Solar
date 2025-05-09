from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from products.models import Product
from django.core.files.uploadedfile import SimpleUploadedFile
import os

class ProductTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.list_url = reverse('product-list')
        self.detail_url = reverse('product-detail', args=[1])
        
        # Create test product
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=99.99,
            sustainability_score=80,
            solar_powered=True,
            stock=10
        )
        self.detail_url = reverse('product-detail', args=[self.product.id])

    def test_product_list_normal(self):
        """Test normal product listing"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Product')

    def test_product_list_invalid_method(self):
        """Test product list with invalid method"""
        response = self.client.post(self.list_url, {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_product_list_sql_injection(self):
        """Test product list with SQL injection attempt in query params"""
        response = self.client.get(self.list_url + "?name=test' OR 1=1--")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only return actual products, not vulnerable to SQLi
        self.assertEqual(len(response.data), 1)

    def test_product_detail_normal(self):
        """Test normal product detail view"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product')

    def test_product_detail_invalid_id(self):
        """Test product detail with invalid ID"""
        invalid_url = reverse('product-detail', args=[999])
        response = self.client.get(invalid_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_product_detail_xss_attempt(self):
        """Test product detail with XSS attempt in product data"""
        xss_product = Product.objects.create(
            name='<script>alert(1)</script>',
            description='<script>alert(2)</script>',
            price=99.99,
            sustainability_score=80,
            solar_powered=True,
            stock=10
        )
        url = reverse('product-detail', args=[xss_product.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensure the response is properly escaped
        self.assertNotIn('<script>', response.data['name'])
        self.assertNotIn('<script>', response.data['description'])