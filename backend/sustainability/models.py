from django.db import models
from products.models import Product

class CarbonFootprint(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    co2_saved_kg = models.DecimalField(max_digits=10, decimal_places=2, help_text="CO2 saved in kg compared to non-solar alternative")
    water_saved_liters = models.DecimalField(max_digits=10, decimal_places=2)
    energy_saved_kwh = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Footprint for {self.product.name}"

class ImpactReport(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True)
    date = models.DateField(auto_now_add=True)
    total_co2_saved = models.DecimalField(max_digits=10, decimal_places=2)
    total_energy_saved = models.DecimalField(max_digits=10, decimal_places=2)
    equivalent_trees_planted = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Impact Report {self.date}"