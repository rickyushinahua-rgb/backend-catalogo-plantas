from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TipoPlantaViewSet, PlantaViewSet

router = DefaultRouter()
router.register(r'tipos-plantas', TipoPlantaViewSet)
router.register(r'plantas', PlantaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]