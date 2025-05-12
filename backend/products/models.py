from django.db import models

# products/models.py

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sustainability_score = models.PositiveIntegerField(
        help_text="Score from 1-100 showing environmental impact"
    )
    image = models.ImageField(upload_to='product_images/')
    solar_powered = models.BooleanField(default=True)
    discount_per_sun_point = models.DecimalField(
        max_digits=5, decimal_places=2,
        default=1.00,
        help_text="Discount amount per sun point in currency"
    )
    property = models.JSONField(
        default=dict,
        blank=True,
        help_text="Key-value info about the product, like dimensions, power, etc."
    )
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
