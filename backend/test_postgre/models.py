from django.db import models
from django.contrib.auth.models import AbstractUser


class TimeStampedModel(models.Model):
    """
    Abstrakte Basis-Klasse, die created_at und updated_at Felder bereitstellt
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Person(TimeStampedModel):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    class Meta:
        db_table = 'person'

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    bio = models.TextField(blank=True)
    class Meta:
        db_table = 'CustomUser'

    def __str__(self):
        return self.username
    
class Machine(TimeStampedModel):
    """Modell für Maschinen/Automaten"""
    name = models.CharField(max_length=100)
    machine_id = models.CharField(max_length=50, unique=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Aktiv'),
            ('inactive', 'Inaktiv'),
            ('maintenance', 'Wartung'),
            ('error', 'Fehler')
        ],
        default='active'
    )
    location = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'machine'
    
    def __str__(self):
        return f"{self.name} ({self.machine_id})"
