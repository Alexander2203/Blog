from django.db import models
from django.contrib.auth.models import User  # Импорт встроенной модели пользователя Django

class Event(models.Model):
    title = models.CharField(max_length=100)  # Поле для заголовка события (строка длиной до 100 символов)
    description = models.TextField()  # Поле для описания события (длинный текст)
    created_at = models.DateTimeField(auto_now_add=True)  # Поле для автоматической записи даты и времени создания
    owner = models.ForeignKey(User, on_delete=models.CASCADE)  # Внешний ключ для связи с моделью пользователя.
                                                               # При удалении пользователя, все его события удаляются

    def __str__(self):
        return self.title  # Возвращает строковое представление объекта, в данном случае заголовок события