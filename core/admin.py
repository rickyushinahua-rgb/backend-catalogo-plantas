from django.contrib import admin
from .models import TipoPlanta, Planta
# Register your models here.


@admin.register(TipoPlanta)
class TipoPlantaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'estado')
    search_fields = ('nombre',)
    list_filter = ('estado',)


@admin.register(Planta)
class PlantaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'especie', 'precio', 'stock', 'estado', 'tipo_planta')
    search_fields = ('nombre', 'especie')
    list_filter = ('estado', 'tipo_planta')