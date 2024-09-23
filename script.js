const words = [
    { word: "Привет", translation: "Hello", example: "Привет, как дела?" },
    { word: "Спасибо", translation: "Thank you", example: "Спасибо за помощь." },
    { word: "Пожалуйста", translation: "You’re welcome", example: "Пожалуйста, не за что." },
    { word: "Извините", translation: "Sorry", example: "Извините за опоздание." },
    { word: "Помогите", translation: "Help", example: "Помогите мне, пожалуйста." },
];

let currentIndex = 0;
let testMode = false;
let selectedCards = [];
let correctPairs = 0;
let totalPairs = words.length;

document.addEventListener("DOMContentLoaded", () => {
    updateDisplay();

    document.getElementById("next").addEventListener("click", () => {
        currentIndex++;
        if (currentIndex >= words.length) {
            currentIndex = 0;
        }
        updateDisplay();
    });

    document.getElementById("back").addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = words.length - 1;
        }
        updateDisplay();
    });

    document.getElementById("shuffle-words").addEventListener("click", shuffleWords);
    document.getElementById("exam").addEventListener("click", startExam);
});

// Обновление дисплея
function updateDisplay() {
    const currentWord = words[currentIndex];
    document.querySelector("#card-front h1").innerText = currentWord.word;
    document.querySelector("#card-back h1").innerText = currentWord.translation;
    document.querySelector("#card-back span").innerText = currentWord.example;
    document.getElementById("current-word").innerText = currentIndex + 1; // Отсчет с единицы
    document.getElementById("total-word").innerText = words.length;

    // Обновление прогресса
    document.getElementById("words-progress").value = ((currentIndex + 1) / words.length) * 100;

    // Сброс активной карточки
    const flipCard = document.querySelector(".flip-card");
    flipCard.classList.remove("active");

    // Добавляем обработчик нажатия для переворота карточки
    flipCard.onclick = () => {
        flipCard.classList.toggle("active"); // Переворот карточки
    };
}

// Перемешивание слов
function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    currentIndex = 0;
    updateDisplay();
}

// Запускает режим тестирования
function startExam() {
    testMode = true;
    document.getElementById("study-mode").classList.add("hidden");
    document.getElementById("exam-mode").classList.remove("hidden");
    initExamCards();
}

// Инициализирует карточки для теста
function initExamCards() {
    const examCardsContainer = document.getElementById("exam-cards");
    examCardsContainer.innerHTML = '';

    // Создаем копию массива с словами и перемешиваем
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    shuffledWords.forEach((word) => {
        const card = document.createElement("div");
        card.classList.add("flip-card");
        card.innerHTML = `
    <div class="flip-card-inner">
    <div class="flip-card-front">
    <h1>${word.word}</h1>
    </div>
    <div class="flip-card-back">
    <h1>${word.translation}</h1>
    </div>
    </div>
    `;

        // Добавляем обработчик клика для переворота карточек
        card.onclick = () => {
            card.classList.toggle("active"); // Переворот карточки
            handleExamCardClick(card, word);
        };

        examCardsContainer.appendChild(card);
    });
}

// Обрабатывает клик по карточке в тесте
function handleExamCardClick(card, word) {
    if (selectedCards.length < 2 && !card.classList.contains("correct") && !card.classList.contains("wrong")) {
        card.classList.add("active");
        selectedCards.push(card);

        // Если это первая карточка
        if (selectedCards.length === 1) {
            card.classList.add("correct");
        } else if (selectedCards.length === 2) {
            evaluateSelectedCards(selectedCards, word);
        }
    }
}

// Оценивает выбранные карточки
function evaluateSelectedCards(cards) {
    const firstCardWord = cards[0].querySelector(".flip-card-front h1").innerText;
    const secondCardWord = cards[1].querySelector(".flip-card-back h1").innerText;

    // Если словосочетания совпадают
    if (firstCardWord === secondCardWord) {
        cards.forEach((card) => {
            card.classList.add("fade-out");
            card.classList.add("correct");
            correctPairs++;
        });

        // Проверяем, были ли собраны все пары
        if (correctPairs === totalPairs) {
            setTimeout(() => alert("Поздравляю! Вы прошли тест!"), 500);
        }
    } else {
        cards[1].classList.add("wrong");
        setTimeout(() => {
            cards[1].classList.remove("wrong");
            cards.forEach((card) => card.classList.remove("active"));
        }, 1000);
    }

    selectedCards = []; // Сброс выбранных карточек
}