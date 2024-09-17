document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        card.querySelector('.flip-card-inner').classList.toggle('active');
    });
});

let currentIndex = 0;
const cards = document.querySelectorAll('.flip-card');
const totalWords = cards.length;

function updateCardDisplay() {
    cards.forEach((card, index) => {
        card.style.display = (index === currentIndex) ? 'flex' : 'none';
    });

    document.getElementById('current-word').textContent = currentIndex + 1; // для отображения текущего слова
    document.getElementById('back').disabled = currentIndex === 0; // блокировка кнопки назад
    document.getElementById('next').disabled = currentIndex === totalWords - 1; // блокировка кнопки вперед
}

// Обработчики кликов для кнопок "Назад" и "Вперед"
document.getElementById('back').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCardDisplay();
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentIndex < totalWords - 1) {
        currentIndex++;
        updateCardDisplay();
    }
});

// Вызов функции для первоначального отображения карточки
updateCardDisplay();

document.getElementById('exam').addEventListener('click', () => {
    document.getElementById('study-mode').classList.add('hidden');
    document.getElementById('exam-mode').classList.remove('hidden');

    const examCards = [...cards];
    shuffle(examCards); // Вызов функции перемешивания карточек
    examCards.forEach(card => {
        card.style.display = 'flex'; // Показываем карточки
        card.querySelector('.flip-card-inner').classList.remove('active'); // Убираем переворот
    });
});

let firstCard = null;
let secondCard = null;

examCards.forEach(card => {
    card.addEventListener('click', () => {
        if (!firstCard) {
            firstCard = card;
            firstCard.classList.add('correct'); // подсвечиваем первую карточку
        } else if (!secondCard) {
            secondCard = card;
            secondCard.classList.add('wrong'); // подсвечиваем вторую карточку

            // Сравните карточки
            if (firstCard.getAttribute('data-word') === secondCard.getAttribute('data-translation')) {
                firstCard.classList.add('fade-out');
                secondCard.classList.add('fade-out');

                // Сброс карточек
                firstCard = null;
                secondCard = null;

                // Удалить карточки из DOM, если требуется
                // Можно добавить код для удаления из массива
            } else {
                // Неправильный ответ
                setTimeout(() => {
                    secondCard.classList.remove('wrong');
                    secondCard = null; // Сброс
                }, 1000);

                firstCard = null; // Сброс
            }
        }
    });
});

// После удаления карточек из DOM проверки
if (matchedPairs === examCards.length) {
    alert('Проверка завершена!');
}