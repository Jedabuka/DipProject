import json
import os

from django.shortcuts import render, redirect
from .forms import UserRegister, UserLoginForm
from .models import CustomUser, ReadingHistory
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login
from speed_reading.settings import BASE_DIR
from django.http import JsonResponse, Http404
from django.contrib.auth.decorators import login_required


def register(request):
    if request.method == 'POST':
        form = UserRegister(request.POST)
        if form.is_valid():

            cleaned_data = form.cleaned_data
            user = CustomUser.objects.create(
                username=cleaned_data['username'],
                first_name=cleaned_data['first_name'],
                last_name=cleaned_data['last_name'],
                age=cleaned_data['age'],
                email=cleaned_data['email'],
                password=make_password(cleaned_data['password'])
            )
            return render(request, 'success.html', {'username': user.username})
    else:
        form = UserRegister()

    return render(request, 'register.html', {'form': form})


def get_data(file_name):
    """Считывает данные из указанного файла."""
    file_path = BASE_DIR / 'data' / file_name
    if file_path.exists():
        with file_path.open('r', encoding='utf-8') as file:
            return [line.strip() for line in file.readlines()]
    else:
        return []  # Возвращаем пустой список, если файл не найден

def load_all_levels():
    """Динамически загружает все уровни, соответствующие шаблону level_*.txt."""
    levels = {}
    data_dir = BASE_DIR / 'data'
    for file_path in data_dir.glob('level_*.txt'):
        level_name = file_path.stem  # Получаем имя файла без расширения
        levels[level_name] = get_data(file_path.name)
    return levels

def trainer(request):
    levels = load_all_levels()  # Загрузка всех уровней
    levels_json = json.dumps(levels)  # Преобразование данных в JSON
    levels_count = len(levels)  # Подсчёт количества уровней
    first_level_key = list(levels.keys())[0]  # Первый уровень (например, 'level_1')
    first_level_data = levels[first_level_key]  # Данные первого уровня

    return render(request, 'trainer.html', {
        'levels_json': levels_json,  # Передаём уровни в шаблон
        'levels_count': levels_count,  # Передаём количество уровней
        'first_level_length': len(first_level_data),
    })


def user_login(request):
    if request.method == 'POST':
        form_log = UserLoginForm(request.POST)
        if form_log.is_valid():
            email = form_log.cleaned_data['email']
            password = form_log.cleaned_data['password']
            user = authenticate(email=email, password=password)
            if user:
                login(request, user)
                return redirect('trainer')  # Перенаправляем на страницу тренажера
    else:
        form_log = UserLoginForm()
    return render(request, 'login.html', {'form_log': form_log})

# API для загрузки текстов
def get_texts(request):
    file_path = os.path.join(BASE_DIR, 'data', 'texts.json')  # Абсолютный путь к файлу
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return JsonResponse(data)
    except FileNotFoundError:
        return JsonResponse({'error': 'Файл texts.json не найден'}, status=404)

def get_text_by_id(request, text_id):
    file_path = os.path.join(BASE_DIR, 'data', 'texts.json')  # Абсолютный путь к файлу
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        text = next((item for item in data['texts'] if item['id'] == text_id), None)
        if not text:
            raise Http404("Текст с таким ID не найден.")
        return JsonResponse(text)
    except FileNotFoundError:
        return JsonResponse({'error': 'Файл texts.json не найден'}, status=404)


@login_required
def save_reading_speed(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        text_name = data.get('text_name')  # Получаем название текста
        words_read = data.get('words_read')  # Количество прочитанных слов

        # Сохраняем данные в базу
        ReadingHistory.objects.create(
            user=request.user,
            text_name=text_name,
            words_read=words_read
        )
        return JsonResponse({'status': 'success'})
    return JsonResponse({'error': 'Invalid request'}, status=400)


