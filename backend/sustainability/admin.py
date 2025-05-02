from django.contrib import admin
from .models import CarbonFootprint, ImpactReport

class CarbonFootprintAdmin(admin.ModelAdmin):
    list_display = ('product', 'co2_saved_kg', 'energy_saved_kwh')
    search_fields = ('product__name',)
    autocomplete_fields = ('product',)

@admin.register(ImpactReport)
class ImpactReportAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'total_co2_saved', 'equivalent_trees_planted')
    list_filter = ('date',)
    search_fields = ('user__username',)
    readonly_fields = ('date',)

admin.site.register(CarbonFootprint, CarbonFootprintAdmin)