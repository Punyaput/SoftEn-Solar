# users/serializers.py
from rest_framework import serializers
from .models import CustomUser
from django.conf import settings

from orders.models import Order
from orders.serializers import OrderSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    recent_orders = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'bio', 'avatar_url', 'phone_number', 'address',
            'sun_points', 'total_co2_saved', 'total_energy_saved', 'streak_days',
            'recent_orders',
        ]
        read_only_fields = ['username', 'sun_points', 'total_co2_saved', 'total_energy_saved']
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.avatar.url)
            return f"{settings.BASE_URL}{obj.avatar.url}"
        return None
    
    def get_recent_orders(self, obj):
        orders = Order.objects.filter(user=obj).order_by('-created_at')[:3]
        return OrderSerializer(orders, many=True).data
