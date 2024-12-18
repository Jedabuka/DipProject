from django.db import models
from django.utils.timezone import localtime
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField()
    password = models.CharField(max_length=128)

    groups = models.ManyToManyField('auth.Group', related_name='customuser_groups', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='customuser_permissions', blank=True)

    USERNAME_FIELD = 'email'  # Указываем, что email используется для аутентификации
    REQUIRED_FIELDS = ['username']  # Поля, которые запрашиваются при создании пользователя через manage.py createsuperuser

    def __str__(self):
        return self.username


class ReadingHistory(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reading_history')
    text_name = models.CharField(max_length=255)  # Название выбранного текста
    words_read = models.PositiveIntegerField()  # Количество прочитанных слов
    date = models.DateTimeField(auto_now_add=True)  # Дата и время замера

    def __str__(self):
        formatted_date = localtime(self.date).strftime('%d-%m-%Y')
        return f"{self.user.first_name} | Текст: {self.text_name} | Кол-во слов: {self.words_read} | {formatted_date}"

