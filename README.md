# Тренажер для скорочтения

## Запуск проекта

### 1. Клонирование репозитория
Склонируйте проект с GitHub:
```bash
git clone https://github.com/Jedabuka/DipProject.git
cd DipProject
```

### 2. Установка зависимостей
Установите все необходимые зависимости из файла `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 3. Настройка базы данных
Создайте базу данных в PostgreSQL и настройте доступ в файле `settings.py`:
```python
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
```

Выполните миграции:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Запуск сервера
Запустите локальный сервер разработки:
```bash
python manage.py runserver
```

Проект будет доступен по адресу [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## Автор
**Евгений Лаптев**  
- **Email:** pgsun@yandex.ru  
- **GitHub:** [Jedabuka](https://github.com/Jedabuka)

---

## Лицензия
Лицензия отсутствует.
