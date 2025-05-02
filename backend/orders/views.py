# orders/views.py
from django.db import transaction
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product
import logging

logger = logging.getLogger(__name__)

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            user = request.user
            data = request.data
            
            # Validate required fields
            required_fields = [
                'shipping_name', 'email', 'address', 
                'city', 'zip_code', 'items'
            ]
            if not all(field in data for field in required_fields):
                raise ValidationError('Missing required fields')
            
            if not isinstance(data['items'], list) or len(data['items']) == 0:
                raise ValidationError('Order must contain at least one item')

            # Prepare order data
            order_data = {
                'user': user,
                'shipping_name': data['shipping_name'],
                'email': data['email'],
                'address': data['address'],
                'city': data['city'],
                'zip_code': data['zip_code'],
                'status': 'pending'
            }

            # Process items and calculate totals
            items_data = []
            subtotal = 0
            
            for item in data['items']:
                try:
                    product = Product.objects.get(pk=item['product_id'])
                    quantity = int(item['quantity'])
                    
                    if quantity <= 0:
                        raise ValidationError('Quantity must be positive')
                    if product.stock < quantity:
                        raise ValidationError(f'Not enough stock for {product.name}')
                    
                    items_data.append({
                        'product': product,
                        'quantity': quantity,
                        'price': product.price
                    })
                    subtotal += product.price * quantity
                except (Product.DoesNotExist, KeyError, ValueError) as e:
                    raise ValidationError(f'Invalid product data: {str(e)}')

            # Process sun points
            points_used = min(
                user.sun_points,
                max(0, int(data.get('sun_points_used', 0))
            ))
            discount = float(points_used)
            
            # Calculate order totals
            shipping_cost = 0  # Could be calculated based on address
            tax = float(subtotal) * 0.1  # Example 10% tax
            total = max((float(subtotal) + shipping_cost + tax) - discount, 0)
            
            # Update order data with calculated values
            order_data.update({
                'subtotal': subtotal,
                'shipping_cost': shipping_cost,
                'tax': tax,
                'sun_points_used': points_used,
                'discount_from_points': discount,
                'total': total
            })

            # Create the order
            order = Order.objects.create(**order_data)
            
            # Create order items
            OrderItem.objects.bulk_create([
                OrderItem(
                    order=order,
                    product=item['product'],
                    quantity=item['quantity'],
                    price=item['price']
                ) for item in items_data
            ])
            
            # Update product stock
            for item in items_data:
                item['product'].stock -= item['quantity']
                item['product'].save()
            
            # Deduct sun points if used
            if points_used > 0:
                user.sun_points -= points_used
                user.save(update_fields=['sun_points'])
            
            response_serializer = self.get_serializer(order)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Order creation failed: {str(e)}", exc_info=True)
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related('user').prefetch_related('items')

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)