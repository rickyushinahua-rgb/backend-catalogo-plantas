from django.db import models


class TipoPlanta(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='tipos_plantas/')
    estado = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Tipo de planta'
        verbose_name_plural = 'Tipos de plantas'

    def __str__(self):
        return self.nombre


class Planta(models.Model):
    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=150)
    descripcion = models.TextField()
    cuidados = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    imagen = models.ImageField(upload_to='plantas/')
    estado = models.BooleanField(default=True)
    tipo_planta = models.ForeignKey(
        TipoPlanta,
        on_delete=models.CASCADE,
        related_name='plantas'
    )

    class Meta:
        verbose_name = 'Planta'
        verbose_name_plural = 'Plantas'

    def __str__(self):
        return self.nombre