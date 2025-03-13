from django.contrib import admin
from .models import Person

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'updated_at')
    search_fields = ('name', 'email')
    list_filter = ('created_at', 'updated_at')