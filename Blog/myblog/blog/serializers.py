from rest_framework import serializers  # Импортируем модуль сериализаторов Django REST Framework
from .models import Event  # Импортируем модель Event из текущего приложения

# Определяем сериализатор для модели Event
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event  # Указываем, что сериализатор работает с моделью Event
        fields = ['id', 'title', 'description', 'created_at', 'owner']  # Поля модели, которые будут сериализованы
        read_only_fields = ['owner', 'created_at']  # Поля, которые только для чтения (нельзя изменять через API)