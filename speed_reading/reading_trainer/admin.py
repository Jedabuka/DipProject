from django.contrib import admin
from .models import CustomUser, ReadingHistory

admin.site.register(CustomUser)
admin.site.register(ReadingHistory)
