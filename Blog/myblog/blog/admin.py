from django.contrib import admin
from .models import Event

# Определяем, как модель Event будет отображаться в админке
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'created_at', 'owner')  # Поля, которые будут отображаться в списке
    search_fields = ('title', 'description')  # Поля, по которым можно будет искать
    list_filter = ('created_at', 'owner')  # Добавляем возможность фильтрации по дате и владельцу

# Регистрируем модель Event в админке
admin.site.register(Event, EventAdmin)