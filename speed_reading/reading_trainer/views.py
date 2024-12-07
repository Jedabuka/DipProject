import json
from django.http import Http404
from django.shortcuts import render
from .forms import UserRegister
from .models import CustomUser
from django.contrib.auth.hashers import make_password
from speed_reading.settings import BASE_DIR


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


def get_alphabet():
    file_path = BASE_DIR / 'data' / 'level_1.txt'
    with file_path.open('r', encoding='utf-8') as file:
        return [line.strip() for line in file.readlines()]


def get_level_2():
    file_path = BASE_DIR / 'data' / 'level_2.txt'
    with file_path.open('r', encoding='utf-8') as file:
        return [line.strip() for line in file.readlines()]


def trainer(request):
    level = request.GET.get('level', '1')
    if level == '1':
        data = get_alphabet()
    elif level == '2':
        data = get_level_2()
    else:
        raise Http404("Уровень сложности не найден")

    data_json = json.dumps(data)
    return render(request, 'trainer.html', {'data_json': data_json})

def trainer_1(request):
    level = request.GET.get('level', '1')
    if level == '1':
        data = get_alphabet()
    elif level == '2':
        data = get_level_2()
    else:
        raise Http404("Уровень сложности не найден")

    data_json = json.dumps(data)
    return render(request, 'trainer_1.html', {'data_json': data_json})

def get_data(file_name):
    file_path = BASE_DIR / 'data' / file_name
    with file_path.open('r', encoding='utf-8') as file:
        return [line.strip() for line in file.readlines()]

def trainer_2(request):
    level_1 = get_data('level_1.txt')
    level_2 = get_data('level_2.txt')

    # Преобразование данных в JSON
    level_1_json = json.dumps(level_1)
    level_2_json = json.dumps(level_2)

    return render(request, 'trainer.html', {
        'level_1': level_1_json,
        'level_2': level_2_json,
    })
