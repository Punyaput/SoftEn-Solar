from rest_framework import serializers
from django.conf import settings
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 
                'sustainability_score', 'image_url', 
                'solar_powered', 'created_at', 'stock']
    

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None