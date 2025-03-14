import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from test_postgre.models import Machine

class Command(BaseCommand):
    help = 'Erstellt Testdaten für Maschinen'

    def add_arguments(self, parser):
        parser.add_argument(
            'count', 
            type=int, 
            help='Anzahl der zu erstellenden Maschinen'
        )
        
        parser.add_argument(
            '--clear', 
            action='store_true', 
            help='Vorhandene Maschinen löschen, bevor neue erstellt werden'
        )

    def handle(self, *args, **options):
        count = options['count']
        clear = options.get('clear', False)
        
        if clear:
            self.stdout.write('Lösche bestehende Maschinen...')
            Machine.objects.all().delete()
        
        # Liste von Beispielstandorten
        locations = [
            'Berlin Hauptbahnhof', 'Berlin Alexanderplatz', 'Berlin Friedrichstraße',
            'Hamburg Hauptbahnhof', 'Hamburg Altona', 'Hamburg Jungfernstieg',
            'München Hauptbahnhof', 'München Marienplatz', 'München Ostbahnhof',
            'Köln Hauptbahnhof', 'Köln Dom', 'Köln Messe',
            'Frankfurt Hauptbahnhof', 'Frankfurt Flughafen', 'Frankfurt Messe',
            'Stuttgart Hauptbahnhof', 'Düsseldorf Hauptbahnhof', 'Hannover Hauptbahnhof'
        ]
        
        # Status-Optionen (mit Wahrscheinlichkeit)
        statuses = ['active', 'inactive', 'maintenance', 'error']
        status_weights = [0.7, 0.1, 0.15, 0.05]  # 70% aktiv, 10% inaktiv, 15% Wartung, 5% Fehler
        
        # Progress-Anzeige
        self.stdout.write(f'Erstelle {count} Test-Maschinen...')
        
        # Bulk-Create für bessere Performance
        machines = []
        for i in range(1, count + 1):
            # Machine ID generieren (M-12345)
            machine_id = f"M-{10000 + i}"
            
            # Status wählen (gewichtet)
            status = random.choices(statuses, weights=status_weights)[0]
            
            # Standort wählen
            location = random.choice(locations)
            
            # Neuen Maschinen-Datensatz erstellen
            machine = Machine(
                name=f"Automat {i}",
                machine_id=machine_id,
                status=status,
                location=location
            )
            
            machines.append(machine)
            
            # Batch-Größe für Bulk Create (1000 Maschinen pro Batch)
            if len(machines) >= 1000 or i == count:
                Machine.objects.bulk_create(machines)
                machines = []
                self.stdout.write(f'  {i} von {count} Maschinen erstellt')
        
        self.stdout.write(self.style.SUCCESS(f'Erfolgreich {count} Maschinen erstellt!'))
        
        # Statistiken anzeigen
        active_count = Machine.objects.filter(status='active').count()
        inactive_count = Machine.objects.filter(status='inactive').count()
        maintenance_count = Machine.objects.filter(status='maintenance').count()
        error_count = Machine.objects.filter(status='error').count()
        
        self.stdout.write("\nStatistik der erstellten Maschinen:")
        self.stdout.write(f"- Aktive Maschinen: {active_count}")
        self.stdout.write(f"- Inaktive Maschinen: {inactive_count}")
        self.stdout.write(f"- Maschinen in Wartung: {maintenance_count}")
        self.stdout.write(f"- Maschinen mit Fehler: {error_count}")