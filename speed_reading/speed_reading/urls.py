"""
URL configuration for speed_reading project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from reading_trainer.views import register, trainer, user_login, get_texts, save_reading_speed, get_text_by_id

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('trainer/', trainer, name='trainer'),
    path('login/', user_login, name='login'),
    path('api/texts/', get_texts, name='get_texts'),
    path('api/save_reading_speed/', save_reading_speed, name='save_reading_speed'),
    path('api/texts/<int:text_id>/', get_text_by_id, name='get_text_by_id'),
]
