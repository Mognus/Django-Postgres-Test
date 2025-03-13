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

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    bio = models.TextField(blank=True)
    def __str__(self):
        return self.username
