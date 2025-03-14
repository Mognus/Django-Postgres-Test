import django_filters
from django.db import models
from .models import Machine

class MachineFilter(django_filters.FilterSet):
    """
    FilterSet für Maschinen - definiert, wie gefiltert werden kann
    """
    # Filter für Status (exakte Übereinstimmung)
    status = django_filters.ChoiceFilter(choices=Machine._meta.get_field('status').choices)
    
    # Filter für Location (Teilübereinstimmung, Groß-/Kleinschreibung ignorieren)
    location = django_filters.CharFilter(lookup_expr='icontains')
    
    # Filter für Namen (Teilübereinstimmung)
    name = django_filters.CharFilter(lookup_expr='icontains')
    
    # Filter für ID (Teilübereinstimmung)
    machine_id = django_filters.CharFilter(lookup_expr='icontains')
    
    # Allgemeiner Suchfilter (sucht in mehreren Feldern)
    search = django_filters.CharFilter(method='filter_search')
    
    def filter_search(self, queryset, name, value):
        """
        Custom-Filtermethode für die Suche in mehreren Feldern
        """
        if not value:
            return queryset
            
        # Suche in Name, ID und Standort
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(machine_id__icontains=value) |
            models.Q(location__icontains=value)
        )
    
    class Meta:
        model = Machine
        fields = ['status', 'location', 'name', 'machine_id', 'search']