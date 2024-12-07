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

    def __str__(self):
        return self.username


class ReadingHistory(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reading_history')
    level = models.PositiveIntegerField()
    words_read = models.PositiveIntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        formatted_date = localtime(self.date).strftime('%d-%m-%Y')
        return f"{self.user.first_name} | Кол-во слов: {self.words_read} | {formatted_date}"
