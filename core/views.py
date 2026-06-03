from rest_framework import viewsets
from .models import TipoPlanta, Planta
from .serializers import TipoPlantaSerializer, PlantaSerializer


class TipoPlantaViewSet(viewsets.ModelViewSet):
    queryset = TipoPlanta.objects.all().order_by('id')
    serializer_class = TipoPlantaSerializer


class PlantaViewSet(viewsets.ModelViewSet):
    queryset = Planta.objects.all().order_by('id')
    serializer_class = PlantaSerializer