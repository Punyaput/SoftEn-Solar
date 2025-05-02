# orders/models.py
from django.db import models
from users.models import CustomUser
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    order_number = models.CharField(max_length=20, unique=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Shipping information
    shipping_name = models.CharField(max_length=100, default="Cash on Delivery")
    email = models.EmailField(default="")
    address = address = models.CharField(max_length=255, default="Unknown Address")
    city = models.CharField(max_length=100, default="Unknown City")
    zip_code = models.CharField(max_length=20, default=0)
    
    # Financial information
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sun_points_used = models.PositiveIntegerField(default=0)
    discount_from_points = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_order_number():
        from django.utils import timezone
        return timezone.now().strftime('ORD%Y%m%d') + str(Order.objects.count() + 1).zfill(5)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    @property
    def total_price(self):
        return self.quantity * self.price
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name} @ {self.price}"