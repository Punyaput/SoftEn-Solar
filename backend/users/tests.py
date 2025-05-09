# from django.test import TestCase
# from django.urls import reverse
# from rest_framework.test import APIClient
# from rest_framework import status
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class UserTests(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.user = User.objects.create_user(
#             username='testuser',
#             password='testpass123',
#             email='test@example.com'
#         )
#         self.admin = User.objects.create_superuser(
#             username='admin',
#             password='adminpass123',
#             email='admin@example.com'
#         )
#         self.register_url = reverse('/api/users/signup')
#         self.whoami_url = reverse('whoami')
#         self.profile_url = reverse('user-detail')
#         self.claim_sun_url = reverse('claim-sun-point')
#         self.sun_status_url = reverse('sun_point_status')

#     def test_register_user_normal(self):
#         """Test normal user registration"""
#         data = {
#             'username': 'newuser',
#             'password': 'Complexpass123!'
#         }
#         response = self.client.post(self.register_url, data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertTrue(User.objects.filter(username='newuser').exists())

#     def test_register_user_invalid_password(self):
#         """Test registration with invalid password"""
#         data = {
#             'username': 'newuser',
#             'password': '123'  # Too simple
#         }
#         response = self.client.post(self.register_url, data)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertIn('detail', response.data)

#     def test_register_user_sql_injection(self):
#         """Test registration with SQL injection attempt"""
#         data = {
#             'username': "admin'--",
#             'password': "password"
#         }
#         response = self.client.post(self.register_url, data)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertFalse(User.objects.filter(username="admin'--").exists())

#     def test_whoami_normal(self):
#         """Test whoami endpoint with authenticated user"""
#         self.client.force_authenticate(user=self.user)
#         response = self.client.get(self.whoami_url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['username'], self.user.username)

#     def test_whoami_unauthenticated(self):
#         """Test whoami endpoint without authentication"""
#         response = self.client.get(self.whoami_url)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_whoami_xss_attempt(self):
#         """Test whoami with XSS attempt in username"""
#         xss_user = User.objects.create_user(
#             username='<script>alert(1)</script>',
#             password='testpass123'
#         )
#         self.client.force_authenticate(user=xss_user)
#         response = self.client.get(self.whoami_url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         # Ensure the response is properly escaped
#         self.assertNotIn('<script>', response.data['username'])

#     def test_profile_view_normal(self):
#         """Test normal profile view"""
#         self.client.force_authenticate(user=self.user)
#         response = self.client.get(self.profile_url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['username'], self.user.username)

#     def test_profile_view_invalid_method(self):
#         """Test profile view with invalid method"""
#         self.client.force_authenticate(user=self.user)
#         response = self.client.post(self.profile_url, {})
#         self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

#     def test_claim_sun_point_normal(self):
#         """Test claiming sun points during valid time"""
#         from django.utils import timezone
#         from datetime import datetime, timedelta
#         import pytz
        
#         # Mock time to be within 8-9 AM
#         test_time = datetime.now().replace(hour=8, minute=0, second=0, microsecond=0, tzinfo=pytz.UTC)
#         with timezone.override(test_time):
#             self.client.force_authenticate(user=self.user)
#             response = self.client.post(self.claim_sun_url)
#             self.assertEqual(response.status_code, status.HTTP_200_OK)
#             self.assertIn('sun_points', response.data)

#     def test_claim_sun_point_outside_window(self):
#         """Test claiming sun points outside valid time"""
#         from django.utils import timezone
#         from datetime import datetime, timedelta
#         import pytz
        
#         # Mock time to be outside 8-9 AM
#         test_time = datetime.now().replace(hour=10, minute=0, second=0, microsecond=0, tzinfo=pytz.UTC)
#         with timezone.override(test_time):
#             self.client.force_authenticate(user=self.user)
#             response = self.client.post(self.claim_sun_url)
#             self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#             self.assertIn('can only be claimed between', response.data['message'])

#     def test_sun_point_status_normal(self):
#         """Test getting sun point status"""
#         self.client.force_authenticate(user=self.user)
#         response = self.client.get(self.sun_status_url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertIn('sun_points', response.data)
#         self.assertIn('streak_days', response.data)