from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonViewSet, MachineViewSet

router = DefaultRouter()
router.register(r'persons', PersonViewSet)
router.register(r'machines', MachineViewSet)

app_name = 'test_postgre'

urlpatterns = [
    path('', include(router.urls)),
]