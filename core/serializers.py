from rest_framework import serializers
from .models import TipoPlanta, Planta


class TipoPlantaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = TipoPlanta
        fields = [
            'id',
            'nombre',
            'descripcion',
            'imagen',
            'imagen_url',
            'estado',
        ]

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen and request:
            return request.build_absolute_uri(obj.imagen.url)
        return None


class PlantaSerializer(serializers.ModelSerializer):
    tipo_planta_nombre = serializers.CharField(source='tipo_planta.nombre', read_only=True)
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Planta
        fields = [
            'id',
            'nombre',
            'especie',
            'descripcion',
            'cuidados',
            'precio',
            'stock',
            'imagen',
            'imagen_url',
            'estado',
            'tipo_planta',
            'tipo_planta_nombre',
        ]

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen and request:
            return request.build_absolute_uri(obj.imagen.url)
        return None