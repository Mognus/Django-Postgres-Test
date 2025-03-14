from rest_framework import serializers
from .models import Person, Machine

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name', 'email', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class MachineSerializer(serializers.ModelSerializer):
    """
    Serializer für das Machine-Modell
    """
    class Meta:
        model = Machine
        fields = ['id', 'name', 'machine_id', 'status', 'location', 'created_at', 'updated_at']