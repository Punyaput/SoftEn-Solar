from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'sustainability_score', 'solar_powered', 'stock', 'created_at')
    list_filter = ('solar_powered', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('price', 'sustainability_score', 'stock')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'image')
        }),
        ('Pricing', {
            'fields': ('price', 'discount_per_sun_point')
        }),
        ('Inventory', {
            'fields': ('stock',)
        }),
        ('Sustainability', {
            'fields': ('sustainability_score', 'solar_powered')
        }),
        ('Product Details', {
            'fields': ('property',),
            'description': "Enter key-value data like Power Generation, Dimensions, etc."
        }),
    )