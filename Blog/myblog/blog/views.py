from rest_framework import viewsets  # Импортируем viewsets для создания набора представлений (CRUD операций)
from .models import Event  # Импортируем модель Event
from .serializers import EventSerializer  # Импортируем сериализатор для модели Event
from rest_framework.permissions import IsAuthenticatedOrReadOnly  # Импортируем пермишен для ограничения прав доступа

# Определяем набор представлений для модели Event
class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # Переопределяем queryset для фильтрации событий по текущему пользователю
    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user).order_by('-created_at')

    # Переопределяем метод для сохранения события
    def perform_create(self, serializer):
        # Автоматически устанавливаем текущего пользователя как владельца (owner) события при его создании
        serializer.save(owner=self.request.user)