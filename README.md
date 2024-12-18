# Тренажер для скорочтения

## Описание проекта
Данный тренажер помогает улучшить навыки чтения, переходя от слогового к чтению целыми словами.  
Это достигается благодаря необходимости за ограниченное время произносить слова разной длины.  
Дополнительно пользователи могут выполнять физические действия (хлопки, стуки или топот), совмещая тренировку чтения с физической активностью.

---

## Технологии
- **Python** 3.9
- **Django** 4.2.16
- **PostgreSQL** 16.6

---

## Запуск проекта

### 1. Клонирование репозитория
Склонируйте проект с GitHub:
```bash

git clone https://github.com/Jedabuka/DipProject.git
cd DipProject

2. Установка зависимостей
Установите все необходимые зависимости из файла requirements.txt:

bash
Копировать код
pip install -r requirements.txt

3. Настройка базы данных
Создайте базу данных в PostgreSQL и настройте доступ в файле settings.py:

python
Копировать код
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
Выполните миграции:

bash
Копировать код
python manage.py makemigrations
python manage.py migrate

4. Запуск сервера
Запустите локальный сервер разработки:

bash
Копировать код
python manage.py runserver
Проект будет доступен по адресу http://127.0.0.1:8000.

Автор
Евгений Лаптев
Email: pgsun@yandex.ru
GitHub: Jedabuka

Лицензия
Лицензия отсутствует.
