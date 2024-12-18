// Данные всех уровней переданы через Django

console.log(levelsData); // Проверка корректности данных в консоли
let currentData = levelsData['level_1']; // Данные текущего уровня по умолчанию
let index = 0; // Текущий индекс отображаемого элемента
let speed = 1000; // Скорость смены элементов (по умолчанию 1 секунда)
let isRunning = false; // Флаг состояния тренажёра
let isDragging = false; // Флаг состояния перемещения ползунка вручную
let isSpeedTestMode = false; // По умолчанию тренажёр работает в режиме уровней
let timer = null;          // Таймер на 60 секунд
let interval = null;       // Интервал закрашивания
let timeLeft = 10;         // Оставшееся время таймера
let maskElement = null; // Элемент для иконки
let maskPosition = 0;   // Текущая позиция иконки
let maskSpeed = 5;      // Скорость перемещения иконки

const wordDisplay = document.getElementById("wordDisplay"); // Для отображения текущего номера
const positionSlider = document.getElementById("position"); // Ползунок позиции

// Функция обновления отображения текущего элемента
function updateCurrentWordDisplay() {
    const formattedWord = updateTextFormat(currentData[index]); // Применяем форматирование
    document.getElementById("word").textContent = formattedWord; // Обновляем слово на экране
    wordDisplay.textContent = index + 1; // Обновляем отображение номера текущего элемента
    positionSlider.value = index; // Синхронизация позиции ползунка
}

// Обновляем максимальное значение ползунка при смене уровня
function updatePositionSliderMax() {
    positionSlider.max = currentData.length - 1; // Устанавливаем максимальное значение ползунка
    positionSlider.value = index; // Синхронизируем начальное значение ползунка с текущим индексом
}

// Функция обновления уровня сложности
function updateLevel(levelIndex) {
    const levelKey = `level_${levelIndex}`; // Преобразуем индекс в ключ (например, "level_1")
    if (levelsData[levelKey]) {
        document.getElementById("levelDisplay").textContent = `${levelIndex}`; // Обновляем отображение
        currentData = levelsData[levelKey]; // Обновляем данные уровня
        index = 0; // Сбрасываем текущий индекс
        updatePositionSliderMax(); // Синхронизация ползунка
        updateCurrentWordDisplay(); // Синхронизация строки
        console.log(`Переключились на ${levelKey}`, currentData); // Логируем новый уровень
    } else {
        console.error(`Уровень ${levelKey} не найден.`);
    }
}

// Функция отображения следующего элемента
function showNext() {
    index = (index + 1) % currentData.length; // Корректно увеличиваем индекс
    const formattedWord = updateTextFormat(currentData[index]);
    document.getElementById("word").textContent = currentData[index]; // Обновляем слово
    updateCurrentWordDisplay(); // Обновляем ползунок и строку
    console.log("Следующее слово:", formattedWord);
}

// Функция отображения предыдущего элемента
function showPrevious() {
    index = (index - 1 + currentData.length) % currentData.length; // Корректно уменьшаем индекс
    const formattedWord = updateTextFormat(currentData[index]);
    document.getElementById("word").textContent = currentData[index]; // Обновляем слово
    updateCurrentWordDisplay(); // Обновляем ползунок и строку
    console.log("Предыдущее слово:", formattedWord);
}

// Функция получения случайного индекса
function getRandomIndex() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * currentData.length);
    } while (randomIndex === index); // Избегаем повторения текущего элемента
    return randomIndex;
}

// Функция отображения случайного элемента
function showRandom() {
    index = getRandomIndex(); // Обновляем текущий индекс на случайный
    const formattedWord = updateTextFormat(currentData[index]);
    document.getElementById("word").textContent = currentData[index]; // Отображаем элемент
    updateCurrentWordDisplay(); // Синхронизация строки и ползунка
    console.log("Случайное слово:", formattedWord);
}

// Функция запуска автоматического отображения элементов
function startDisplay() {
    const readingSpeedCheckbox = document.getElementById("readingSpeed");

    if (isRunning) return; // Предотвращаем повторный запуск

    if (readingSpeedCheckbox.checked) {
        startReadingSpeedMode(); // Запуск режима измерения скорости чтения
    } else {
        startSimpleMode(); // Запуск обычного режима
    }
}

// Функция остановки автоматического отображения
function stopDisplay() {
    if (interval) clearInterval(interval);
    if (timer) clearInterval(timer);

    if (isSpeedTestMode) {
        const wordElement = document.getElementById("word");

        // Если таймер завершён, не сбрасываем текст и иконку
        if (timeLeft <= 0) {
            console.log("Таймер завершён, текст и иконка остаются на месте.");
            isRunning = false; // Останавливаем процесс
            return; // Выходим из функции, чтобы ничего не сбрасывать
        }

        // Сбрасываем текст в исходное состояние
        wordElement.querySelectorAll("span").forEach((span) => {
            span.style.color = ""; // Восстанавливаем видимость текста
        });

        // Возвращаем иконку в изначальное место
        if (maskElement) {
            const firstSpan = wordElement.querySelector("span");
            if (firstSpan) {
                const spanRect = firstSpan.getBoundingClientRect();
                maskElement.style.left = `${spanRect.left}px`;
                maskElement.style.top = `${spanRect.top}px`;
                console.log("Иконка возвращена в изначальное положение.");
            } else {
                console.warn("Текст отсутствует, невозможно вернуть иконку.");
            }
        }

        console.log("Текст сброшен в исходное состояние.");
    }

    isRunning = false; // Сбрасываем флаг запуска
    console.log("Процесс остановлен.");
}

function startSimpleMode() {
    const wordElement = document.getElementById("word");

    isRunning = true; // Устанавливаем флаг запуска
    isSpeedTestMode = false;

    console.log("Обычный режим запущен.");

    // Интервал для обычного режима
    interval = setInterval(() => {
        const isRandom = document.getElementById("random").checked; // Динамическая проверка состояния чекбокса
        if (isRandom) {
            showRandom();
        } else {
            showNext();
        }
    }, speed);

    // Обработчик изменения скорости
    document.getElementById("speed").addEventListener("input", (e) => {
        if (isRunning && !isSpeedTestMode) {
            speed = parseInt(e.target.value); // Обновляем скорость
            updateSpeedDisplay(speed); // Обновляем отображение скорости

            // Перезапускаем интервал
            clearInterval(interval);
            interval = setInterval(() => {
                const isRandom = document.getElementById("random").checked; // Динамическая проверка состояния чекбокса
                if (isRandom) {
                    showRandom();
                } else {
                    showNext();
                }
            }, speed);

            console.log(`Скорость обновлена в обычном режиме: ${speed} мс.`);
        }
    });
}

function startReadingSpeedMode() {
    const wordElement = document.getElementById("word");
    const words = wordElement.innerText.split(/\s+/).filter(word => word.length > 0);
    let timeLeft = 10; // Время для отладки (по умолчанию 60 секунд)

    if (words.length === 0) {
    console.error("Текст для закрашивания отсутствует.");
    return;
    }

    isRunning = true; // Устанавливаем флаг запуска
    isSpeedTestMode = true;

    wordElement.style.fontSize = "20px";
    wordElement.style.textAlign = "left";
    console.log("Режим измерения скорости запущен.");

    // **Сброс атрибута data-processed и очистка содержимого**
    wordElement.removeAttribute("data-processed");
    wordElement.textContent = words.join(" "); // Восстанавливаем текст без <span>

    // Загружаем маску (если ещё не загружена)
    if (!maskElement) {
        loadMaskIcon();
    }

    // Запуск таймера
    timer = setInterval(() => {
        timeLeft--;
        console.log(`Осталось времени: ${timeLeft} секунд`);

        if (timeLeft <= 0) {
            clearInterval(timer);
            clearInterval(interval);
            isRunning = false; // Останавливаем процесс
            console.log("Таймер завершён. Закрашивание остановлено, текст и иконка зафиксированы.");
            showDoneButton("Закрасьте те слова, что успели прочитать, и нажмите 'Готово'.");
        }
    }, 1000);

    // Запуск закрашивания текста
    processText(words, wordElement, () => {
        clearInterval(timer);
        console.log("Закрашивание завершено.");
    }, speed);
}

// Функция обновления отображаемой скорости
function updateSpeedDisplay(value) {
    const speedInSeconds = (value / 1000).toFixed(2); // Преобразуем миллисекунды в секунды
    document.getElementById("speedDisplay").textContent = speedInSeconds; // Обновляем текст рядом с ползунком
}

// Функция применения формата
function applyFormat() {
    const formattedWord = updateTextFormat(currentData[index]);
    document.getElementById("word").textContent = formattedWord;
    console.log("Форматирование применено:", formattedWord);
}

function updateTextFormat(word) {
    const titleChecked = document.getElementById("title").checked;
    const smallChecked = document.getElementById("small").checked;
    const bigChecked = document.getElementById("big").checked;

    if (titleChecked) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Заглавная первая буква
    } else if (smallChecked) {
        return word.toLowerCase(); // Все строчные
    } else if (bigChecked) {
        return word.toUpperCase(); // Все заглавные
    } else {
        return word; // Оригинальный формат
    }
}

function saveResults(wordsRead, textName) {
    fetch('/api/save_reading_speed/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words_read: wordsRead, text_name: textName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert("Результаты сохранены!");
        }
    });
}

function processText(words, textElement, onComplete, speed) {
    let currentCharIndex = 0; // Индекс текущего символа
    let spans = [];
    let currentInterval = null;

    if (!textElement.hasAttribute("data-processed")) {
        spans = Array.from(textElement.innerText).map(char => {
            const span = document.createElement("span");
            span.textContent = char;
            return span;
        });
        textElement.innerText = ""; // Очищаем текст
        spans.forEach(span => textElement.appendChild(span));
        textElement.setAttribute("data-processed", "true");
    } else {
        spans = Array.from(textElement.querySelectorAll("span"));
    }

    if (!maskElement) {
        console.error("Иконка не найдена. Убедитесь, что маска загружена.");
        return;
    }

    function startInterval() {
        clearInterval(currentInterval); // Очищаем старый интервал
        currentInterval = setInterval(() => {
            if (!isRunning) {
                clearInterval(currentInterval);
                return;
            }

            if (currentCharIndex < spans.length) {
                spans[currentCharIndex].style.color = "transparent";

                const spanRect = spans[currentCharIndex].getBoundingClientRect();
                maskElement.style.left = `${spanRect.left - 50}px`;
                maskElement.style.top = `${spanRect.top - 25}px`;

                currentCharIndex++;
            } else {
                clearInterval(currentInterval);
                onComplete();
            }
        }, speed);
    }

    document.getElementById("speed").addEventListener("input", (e) => {
        speed = parseInt(e.target.value);
        updateSpeedDisplay(speed);
        startInterval();
    });

    startInterval();
}

function countReadWords() {
    const wordElement = document.getElementById("word");

    // Собираем текст из всех <span> внутри элемента
    const spans = Array.from(wordElement.querySelectorAll('span'));
    const visibleText = spans
        .filter(span => span.style.color === 'transparent') // Учитываем только закрашенные символы
        .map(span => span.textContent) // Берём текст
        .join(''); // Собираем в строку

    // Удаляем пунктуацию и разделяем текст по пробелам
    const words = visibleText
        .replace(/[.,!?;:-]/g, '') // Убираем пунктуационные символы
        .split(' ') // Разделяем по пробелам
        .filter(word => word.trim().length > 0); // Убираем пустые элементы

    return words.length; // Возвращаем количество слов
}

function displayReadingResult(readWords) {
    const wordElement = document.getElementById("word");
    wordElement.innerText = `Вы прочитали ${readWords} слов(а)`;
    wordElement.style.textAlign = 'center';
    wordElement.style.fontSize = '30px';

    setTimeout(() => {
        console.log("Ждём клик пользователя для возврата к исходному состоянию.");

        // Обработчик клика для сброса текста и стилей
        const handleClick = () => {
            // Сбрасываем режим замера скорости
            isSpeedTestMode = false;

            // Возвращаем текст и стили в исходное состояние
            wordElement.textContent = "...";
            wordElement.style.fontSize = "100px";
            wordElement.style.textAlign = "center";

            // Удаляем обработчик события после выполнения, чтобы избежать дублирования
            document.removeEventListener("click", handleClick);

            console.log("Результат сброшен. Текст и стили восстановлены.");
        };

        // Добавляем обработчик клика к документу
        document.addEventListener("click", handleClick);
    }, 1000); // Задержка 3 секунды перед активацией обработчика
}

function showDoneButton(message) {
    const modalContainer = document.getElementById("modalContainer");
    const resultMessage = document.getElementById("resultMessage");
    const doneButton = document.getElementById("doneButton");
    const readingSpeedCheckbox = document.getElementById("readingSpeed");
    const toggleIcon = document.getElementById("toggleIcon"); // Получаем иконку кнопки
    const wordElement = document.getElementById("word");

    resultMessage.textContent = message; // Устанавливаем сообщение
    modalContainer.style.display = "block"; // Показываем модальное окно

    // Обработчик кнопки "Готово"
    doneButton.onclick = () => {
        const readWords = countReadWords(); // Подсчёт слов
        displayReadingResult(readWords); // Вывод результата
        modalContainer.style.display = "none"; // Закрываем модальное окно
        isRunning = false; // Останавливаем процесс
        console.log("После переключения:", { isRunning });

        // Сбрасываем галочку чекбокса после выполнения действий
        readingSpeedCheckbox.checked = false;
        toggleIcon.src = "/static/img/play.png"; // Меняем иконку на "Старт"
        toggleIcon.alt = "Старт"
        console.log("Галочка с чекбокса readingSpeed сброшена.");

    };
}

function loadTexts() {
    fetch('/api/texts/')
        .then(response => response.json())
        .then(data => {
            const textSelection = document.getElementById('textSelection');
            textSelection.innerHTML = ""; // Очищаем старые опции

            data.texts.forEach(text => {
                const option = document.createElement('option');
                option.value = text.id;
                option.textContent = text.name;
                textSelection.appendChild(option);
            });

            console.log("Тексты загружены:", data.texts);

            // Привязка события для изменения текста
            textSelection.addEventListener("change", (e) => {
                const selectedTextId = e.target.value;

                if (!selectedTextId) {
                    console.error("Текст не выбран.");
                    return;
                }

                fetch(`/api/texts/${selectedTextId}/`)
                    .then(response => response.json())
                    .then(data => {
                        const wordElement = document.getElementById("word");
                        wordElement.textContent = ""; // Очищаем блок для текста

                        // Оборачиваем текст в <span> элементы
                        const textContent = data.content;
                        textContent.split('').forEach(char => {
                            const span = document.createElement('span');
                            span.textContent = char;
                            wordElement.appendChild(span);
                        });

                        console.log(`Текст "${data.name}" загружен.`);

                        // Привязываем иконку к первому символу
                        loadMaskIcon();
                    })
                    .catch(err => console.error("Ошибка при загрузке текста:", err));
            });
        })
        .catch(err => console.error("Ошибка при загрузке текстов:", err));
}


function toggleReadingSpeedMode(e) {
    const isChecked = e.target.checked;
    const wordElement = document.getElementById("word");
    const toggleIcon = document.getElementById("toggleIcon");

    stopDisplay(); // Останавливаем текущие процессы
    toggleIcon.src = "/static/img/play.png";
    toggleIcon.alt = "Старт";

    if (isChecked) {
        isSpeedTestMode = true;
        const selectedTextId = document.getElementById("textSelection").value;

        if (!selectedTextId) {
            alert('Пожалуйста, выберите текст для чтения.');
            e.target.checked = false;
            isSpeedTestMode = false;
            return;
        }

        fetch(`/api/texts/${selectedTextId}/`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки текста.');
                return response.json();
            })
            .then(data => {
                wordElement.textContent = data.content;
                wordElement.style.fontSize = "20px";
                wordElement.style.textAlign = "left";
                console.log(`Загружен текст: ${data.name}`);
            })
            .catch(err => {
                console.error("Ошибка при загрузке текста:", err);
                isSpeedTestMode = false;
            });
    } else {
        isSpeedTestMode = false;
        wordElement.textContent = "...";
        wordElement.style.fontSize = "100px";
        wordElement.style.textAlign = "center";
    }
}

function initAccordions() {
    console.log("Аккордеоны инициализированы");
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach((header) => {
        const icon = header.querySelector(".accordion-icon");
        const collapse = header.nextElementSibling;

        header.addEventListener("click", () => {
            // Если текущий блок открыт, закройте его
            if (collapse.classList.contains("show")) {
                collapse.style.maxHeight = null;
                collapse.classList.remove("show");
                icon.src = "/static/img/down.png";
            } else {
                // Закрываем все остальные
                document.querySelectorAll(".accordion-collapse.show").forEach((openCollapse) => {
                    openCollapse.style.maxHeight = null;
                    openCollapse.classList.remove("show");
                    const openIcon = openCollapse.parentElement.querySelector(".accordion-icon");
                    if (openIcon) openIcon.src = "/static/img/down.png";
                });

                // Открываем текущий
                collapse.classList.add("show");
                collapse.style.maxHeight = collapse.scrollHeight + "px";
                icon.src = "/static/img/up.png";
            }
        });
    });
}

function loadMaskIcon() {
    const maskSelection = document.getElementById("maskSelection").value;
    const wordElement = document.getElementById("word");
    const firstSpan = wordElement.querySelector("span");

    if (!wordElement) {
        console.error("Элемент 'word' не найден.");
        return;
    }

    if (maskSelection === "choice") {
        console.warn("Маска не выбрана. Выберите маску из выпадающего меню.");
        return;
    }

    // Удаляем старую иконку, если она существует
    if (maskElement) maskElement.remove();

    // Создаём новый элемент иконки
    maskElement = document.createElement("img");
    maskElement.src = `/static/img/imgMask/${maskSelection}.png`;
    maskElement.alt = "Иконка маски";
    maskElement.style.position = "absolute";
    maskElement.style.height = "50px"; // Устанавливаем размер
    maskElement.style.width = "50px"; // Устанавливаем размер

    // Если текст уже содержит <span>, позиционируем иконку относительно первого символа
    if (firstSpan) {
        const spanRect = firstSpan.getBoundingClientRect();
        maskElement.style.left = `${spanRect.left - 50}px`;
        maskElement.style.top = `${spanRect.top - 25}px`;
    } else {
        // Если <span> ещё не создан, ставим иконку в начальную позицию
        const wordRect = wordElement.getBoundingClientRect();
        maskElement.style.left = `${wordRect.left}px`;
        maskElement.style.top = `${wordRect.top}px`;
    }

    document.body.appendChild(maskElement);
    console.log(`Иконка "${maskSelection}" добавлена на экран.`);
}

function enableMaskDrag() {
    let isDragging = false;

    maskElement.addEventListener("mousedown", (e) => {
        isDragging = true;
        document.addEventListener("mousemove", moveMask);
        document.addEventListener("mouseup", () => {
            isDragging = false;
            document.removeEventListener("mousemove", moveMask);
        });
    });

    function moveMask(e) {
        if (!isDragging) return;

        // Обновляем позицию иконки
        maskElement.style.left = `${e.pageX}px`;

        // Закрашиваем текст на основе позиции иконки
        updateTextColor(maskElement.style.left);
    }
}

function updateTextColor(maskLeftPosition) {
    const wordElement = document.getElementById("word");
    const spans = wordElement.querySelectorAll("span");

    spans.forEach((span, index) => {
        const spanLeft = span.getBoundingClientRect().left;

        if (spanLeft <= parseInt(maskLeftPosition)) {
            span.style.color = "transparent"; // Закрашиваем символ
        }
    });
}

document.getElementById("maskSelection").addEventListener("change", () => {
    const selectedText = document.getElementById("textSelection").value;
    if (!selectedText) {
        alert("Пожалуйста, выберите текст перед выбором маски.");
        return;
    }
    loadMaskIcon();
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("Тренажёр загружен");

    // Обработчик изменения состояния readingSpeed
    document.getElementById("readingSpeed").addEventListener("change", toggleReadingSpeedMode);

    // Обновляем начальные значения
    updateSpeedDisplay(speed);
    updatePositionSliderMax();
    updateCurrentWordDisplay();
    initAccordions();
    // Загрузка текстов
    loadTexts();
});

document.getElementById("textSelection").addEventListener("change", (e) => {
    const selectedTextId = e.target.value;

    if (!selectedTextId) {
        console.error("Текст не выбран.");
        return;
    }

    fetch(`/api/texts/${selectedTextId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки текста.");
            }
            return response.json();
        })
        .then(data => {
            const wordElement = document.getElementById("word");
            wordElement.textContent = data.content; // Заменяем текст
            wordElement.style.fontSize = "20px";
            wordElement.style.textAlign = "left";
            wordElement.style.color = ""; // Сбрасываем стиль, если текст закрашивался
            console.log(`Текст "${data.name}" загружен.`);
        })
        .catch(err => console.error("Ошибка при загрузке текста:", err));
});

document.getElementById("random").addEventListener("change", () => {
    if (isRunning) {
        startDisplay(); // Перезапускаем процесс с учётом нового режима
    }
});

positionSlider.addEventListener("input", (e) => {
    index = parseInt(e.target.value); // Устанавливаем индекс из значения ползунка
    document.getElementById("word").textContent = currentData[index]; // Обновляем отображение слова
    updateCurrentWordDisplay(); // Синхронизируем отображение индекса

    if (isRunning) {
        // Если показ включён, сразу обновляем контент без остановки
        clearInterval(interval); // Сбрасываем предыдущий интервал
        startDisplay(); // Перезапуск с новым индексом
    }
});

// Событие при завершении перемещения ползунка
positionSlider.addEventListener("change", () => {
    isDragging = false; // Сбрасываем флаг перемещения
});

// Событие запуска/остановки показа слов
document.getElementById("toggleStartStop").addEventListener("click", () => {
    const toggleIcon = document.getElementById("toggleIcon"); // Получаем иконку кнопки
    console.log("Перед переключением:", { isRunning, isSpeedTestMode });

    if (isRunning) {
        stopDisplay(); // Останавливаем показ
        toggleIcon.src = "/static/img/play.png"; // Меняем иконку на "Старт"
        toggleIcon.alt = "Старт"
        console.log("Показ остановлен.");

    } else {
        startDisplay(); // Запускаем показ
        toggleIcon.src = "/static/img/pause.png"; // Меняем иконку на "Пауза"
        toggleIcon.alt = "Пауза";
        console.log("Показ запущен.");
    }

    console.log("После переключения:", { isRunning, isSpeedTestMode });
});

document.getElementById("next").addEventListener("click", () => {
    const isRandom = document.getElementById("random").checked;
    if (isRandom) {
        showRandom(); // Показываем случайный элемент
    } else {
        showNext(); // Показываем следующий элемент
    }
});

// Кнопка "Предыдущий" — показывает предыдущий элемент
document.getElementById("previous").addEventListener("click", () => {
    const isRandom = document.getElementById("random").checked;
    if (isRandom) {
        showRandom();
    } else {
        showPrevious();
    }
});

// Событие изменения скорости
document.getElementById("speed").addEventListener("input", (e) => {
    speed = parseInt(e.target.value); // Обновляем глобальную переменную скорости
    updateSpeedDisplay(speed); // Обновляем отображение скорости

    if (isRunning) {
        if (isSpeedTestMode) {
            // Логика для режима измерения скорости
            clearInterval(interval); // Перезапуск процесса
            processText(
                document.getElementById("word").innerText.split(""), // Символы
                document.getElementById("word"), // Элемент текста
                () => console.log("Закрашивание завершено."), // Callback
                speed // Новая скорость
            );
            console.log(`Скорость обновлена в режиме измерения скорости: ${speed} мс.`);
        } else {
            // Логика для обычного режима
            clearInterval(interval); // Перезапуск интервала
            interval = setInterval(() => {
                const isRandom = document.getElementById("random").checked;
                if (isRandom) {
                    showRandom();
                } else {
                    showNext();
                }
            }, speed);
            console.log(`Скорость обновлена в обычном режиме: ${speed} мс.`);
        }
    }
});



// Обработчики событий для чекбоксов
document.getElementById("title").addEventListener("change", applyFormat);
document.getElementById("small").addEventListener("change", applyFormat);
document.getElementById("big").addEventListener("change", applyFormat);
