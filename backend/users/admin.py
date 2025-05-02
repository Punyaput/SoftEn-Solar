from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'sun_points', 'streak_days', 'total_co2_saved')
    list_filter = ('is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Solar Points', {'fields': ('sun_points', 'last_sun_point_claim', 'streak_days')}),
        ('Sustainability Impact', {'fields': ('total_co2_saved', 'total_energy_saved')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    readonly_fields = ('last_sun_point_claim',)

admin.site.register(CustomUser, CustomUserAdmin)