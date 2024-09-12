from django.urls import path, include  # Импортируем функции для маршрутизации
from rest_framework.routers import DefaultRouter  # Импортируем DefaultRouter для автоматической генерации маршрутов
from .views import EventViewSet  # Импортируем представление для событий

# Создаем экземпляр DefaultRouter, который автоматически генерирует маршруты для CRUD операций
router = DefaultRouter()
# Регистрируем ViewSet для модели Event, с базовым именем 'event'
router.register(r'events', EventViewSet, basename='event')

# Определяем маршруты для приложения
urlpatterns = [
    # Включаем маршруты, сгенерированные роутером
    path('', include(router.urls)),
]