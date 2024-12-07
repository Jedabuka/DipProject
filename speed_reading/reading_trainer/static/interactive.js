const level1 = JSON.parse('{{ level_1_json|escapejs|safe }}');
const level2 = JSON.parse('{{ level_2_json|escapejs|safe }}');
let currentData = level1; // По умолчанию первый уровень
let index = 0;
let interval;
let speed = 1000; // Интервал по умолчанию (1 секунда)

// Обновление уровня сложности
function updateLevel(level) {
    document.getElementById("levelDisplay").textContent = level;
    currentData = level == 1 ? level1 : level2;
    index = 0; // Сброс индекса
}

// Показ следующего элемента
function showNext() {
    if (index >= currentData.length) {
        index = 0;
    }
    document.getElementById("word").textContent = currentData[index];
    index++;
}

// Рандомизация данных
function getRandomIndex() {
    return Math.floor(Math.random() * currentData.length);
}

function showRandom() {
    document.getElementById("word").textContent = currentData[getRandomIndex()];
}

// Старт показа
function startDisplay() {
    clearInterval(interval); // Очищаем старый интервал
    speed = parseInt(document.getElementById("speed").value); // Обновляем скорость перед запуском
    const isRandom = document.getElementById("random").checked;
    interval = setInterval(() => {
        isRandom ? showRandom() : showNext();
    }, speed);
}

// Стоп показа
function stopDisplay() {
    clearInterval(interval);
}

// Обновление отображения скорости в секундах
function updateSpeedDisplay(value) {
    const speedInSeconds = (value / 1000).toFixed(2); // Преобразуем миллисекунды в секунды
    document.getElementById("speedDisplay").textContent = speedInSeconds; // Отображаем значение
}

// Событие изменения скорости
document.getElementById("speed").addEventListener("input", (e) => {
    speed = parseInt(e.target.value);
    updateSpeedDisplay(speed); // Обновляем текст рядом с ползунком
    if (interval) {
        startDisplay(); // Перезапуск интервала с новой скоростью
    }
});

// Добавляем события на кнопки
document.getElementById("start").addEventListener("click", startDisplay);
document.getElementById("stop").addEventListener("click", stopDisplay);
document.getElementById("next").addEventListener("click", () => {
    const isRandom = document.getElementById("random").checked;
    isRandom ? showRandom() : showNext();
});

// Устанавливаем начальное значение отображения скорости
updateSpeedDisplay(speed);
