from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Person, Machine
from .serializers import PersonSerializer, MachineSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import MachineFilter
from rest_framework.pagination import PageNumberPagination

class PersonViewSet(viewsets.ModelViewSet):
    """
    CRUD-API für Person-Objekte
    """
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated]


class MachineViewSet(viewsets.ModelViewSet):
    """
    API-Endpunkt für Maschinen mit django-filter Unterstützung
    """
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    
    # Aktiviere django-filter
    filter_backends = [DjangoFilterBackend]
    filterset_class = MachineFilter  # Verwende den MachineFilter
    
    # Paginierung - zeigt nur 10 Ergebnisse pro Seite
    class MachinesPagination(PageNumberPagination):
        page_size = 10
        page_size_query_param = 'page_size'  # Erlaubt Anpassung der Seitengröße
        max_page_size = 100  # Maximale Ergebnisse pro Seite
    
    pagination_class = MachinesPagination