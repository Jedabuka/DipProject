from django import forms
from .models import CustomUser

class UserRegister(forms.Form):
    username = forms.CharField(
        max_length=30,
        label='Ваш логин:',
        widget=forms.TextInput(attrs={'placeholder': 'Smile'})
    )
    first_name = forms.CharField(
        max_length=30,
        label='Ваше имя:',
        widget=forms.TextInput(attrs={'placeholder': 'Иван'})
    )
    last_name = forms.CharField(
        max_length=30,
        label='Ваша фамилия:',
        widget=forms.TextInput(attrs={'placeholder': 'Иванов'})
    )
    age = forms.IntegerField(
        label='Ваш возраст:',
        widget=forms.NumberInput(attrs={'placeholder': '150'}),
        min_value=1,
        max_value=150
    )
    email = forms.EmailField(
        max_length=30,
        label='Введите email:',
        widget=forms.EmailInput(attrs={'placeholder': 'example@mail.com'})
    )
    password = forms.CharField(
        min_length=8,
        label='Придумайте пароль:',
        widget=forms.PasswordInput()
    )
    repeat_password = forms.CharField(
        min_length=8,
        label='Повторите пароль:',
        widget=forms.PasswordInput()
    )

    def clean_username(self):
        username = self.cleaned_data.get('username', '')
        if ' ' in username:
            raise forms.ValidationError('Логин не должен содержать пробелы.')
        if CustomUser.objects.filter(username=username).exists():
            raise forms.ValidationError('Пользователь с таким логином уже существует.')
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email', '')
        from .models import CustomUser
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError('Пользователь с таким email уже существует.')
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        repeat_password = cleaned_data.get('repeat_password')

        if password and repeat_password and password != repeat_password:
            self.add_error('password', 'Пароли не совпадают.')
            self.add_error('repeat_password', 'Пароли не совпадают.')

        return cleaned_data
