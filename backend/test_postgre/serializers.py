from rest_framework import serializers
from .models import Person

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name', 'email', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']