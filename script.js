// Добавляем элемент основного курсора
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

// Следим за движением мыши для основного курсора
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Активация при клике
document.addEventListener('mousedown', () => {
    cursor.classList.add('active');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
});

// Увеличение курсора при наведении на ссылки и кнопки
document.querySelectorAll('a, button, .btn, .burger, input, textarea').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('link-grow');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('link-grow');
    });
});

// Создание canvas элемента для матрицы
const canvas = document.createElement('canvas');
canvas.id = 'matrix-canvas';
document.body.prepend(canvas);

// Настройка canvas на полный размер окна
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Размер шрифта для символов матрицы
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const rows = Math.floor(canvas.height / fontSize);

// Символы для отображения (символы матрицы)
const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｾﾀﾈﾍﾗｱﾑﾒｴｶｷﾑﾕﾗｸﾖﾜﾀﾓﾘﾃｽﾀﾍｱﾂﾐｹﾊｴｶｷｸｺｻｼﾂｲｸｺｽﾇﾅﾌﾎﾅﾌﾂｵﾘﾒｳｴ∏∑∫∬∭∮∯∰∱∲∳≒≡≧≦≫≪'.split('');

// Инициализация матрицы символов
const matrixGrid = [];
function initializeMatrix() {
    for (let x = 0; x < columns; x++) {
        matrixGrid[x] = [];
        for (let y = 0; y < rows; y++) {
            matrixGrid[x][y] = {
                char: getRandomChar(),
                opacity: 0
            };
        }
    }
}

function getRandomChar() {
    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
}

// Инициализация матрицы
initializeMatrix();

// Переменные для отслеживания положения мыши
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseMoveTime = Date.now();

// Обработка движения мыши
document.addEventListener('mousemove', (e) => {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMouseMoveTime = Date.now();
    
    // Обновляем символы вокруг курсора
    const cursorCellX = Math.floor(mouseX / fontSize);
    const cursorCellY = Math.floor(mouseY / fontSize);
    
    // Устанавливаем высокую непрозрачность для символов вокруг курсора
    updateMatrixAroundCursor(cursorCellX, cursorCellY);
});

// Функция обновления символов вокруг курсора
function updateMatrixAroundCursor(cursorX, cursorY) {
    const radius = 15; // Увеличиваем радиус влияния курсора
    
    for (let x = Math.max(0, cursorX - radius); x < Math.min(columns, cursorX + radius); x++) {
        for (let y = Math.max(0, cursorY - radius); y < Math.min(rows, cursorY + radius); y++) {
            // Вычисляем расстояние от курсора до текущей ячейки
            const dx = x - cursorX;
            const dy = y - cursorY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Если ячейка находится в радиусе влияния курсора
            if (distance < radius) {
                const cell = matrixGrid[x][y];
                
                // С вероятностью 30% меняем символ для большей динамичности
                if (Math.random() < 0.3) {
                    cell.char = getRandomChar();
                }
                
                // Устанавливаем непрозрачность на основе расстояния
                // Чем ближе к курсору, тем выше непрозрачность
                // Используем кубическую функцию для еще более резкого перехода
                const opacity = Math.pow(1 - (distance / radius), 1.2);
                
                // Прибавляем небольшую базовую непрозрачность для долгого сохранения эффекта
                const minOpacity = 0.1; // Минимальная непрозрачность для всех активных символов
                
                // Усиливаем непрозрачность для дольшего сохранения
                cell.opacity = Math.max(cell.opacity, opacity + minOpacity);
            }
        }
    }
}

// Функция для отрисовки матричного эффекта
function drawMatrix() {
    // Очищаем холст (черный фон)
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Постепенное затухание для всех символов (очень медленное)
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Уменьшаем непрозрачность со временем, но очень медленно
            matrixGrid[x][y].opacity *= 0.99; // Замедляем скорость затухания
            
            // С небольшой вероятностью меняем символы даже без движения курсора
            if (matrixGrid[x][y].opacity > 0.1 && Math.random() < 0.02) {
                matrixGrid[x][y].char = getRandomChar();
            }
        }
    }
    
    // Проверка времени с последнего движения мыши
    const timeSinceLastMove = Date.now() - lastMouseMoveTime;
    
    // Если курсор не двигался какое-то время, добавляем активность
    // Увеличиваем частоту обновления символов, когда курсор неподвижен
    if (timeSinceLastMove > 500) { // Уменьшаем время до активации до 500мс
        const cursorCellX = Math.floor(mouseX / fontSize);
        const cursorCellY = Math.floor(mouseY / fontSize);
        
        // Чаще обновляем символы рядом с последней позицией курсора
        if (Math.random() < 0.3) { // Увеличиваем вероятность обновления
            updateMatrixAroundCursor(cursorCellX, cursorCellY);
        }
    }
    
    // Отрисовываем символы
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            const cell = matrixGrid[x][y];
            
            // Рисуем символы с более низким порогом видимости
            if (cell.opacity > 0.005) { // Снижаем порог видимости
                // Яркость напрямую зависит от непрозрачности
                const brightness = Math.min(255, Math.floor(255 * cell.opacity));
                
                // Добавляем небольшой эффект свечения
                const glow = cell.opacity > 0.5 ? 3 : 0;
                if (glow > 0) {
                    ctx.shadowBlur = glow;
                    ctx.shadowColor = `rgba(0, ${brightness}, 0, ${cell.opacity})`;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fillStyle = `rgba(0, ${brightness}, 0, ${cell.opacity})`;
                ctx.font = `${fontSize}px 'VT323', monospace`;
                ctx.fillText(cell.char, x * fontSize, (y + 1) * fontSize);
            }
        }
    }
    
    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(drawMatrix);
}

// Запускаем анимацию матрицы
drawMatrix();

// Обновляем размер canvas при изменении размера окна
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Пересчитываем размеры
    const newColumns = Math.floor(canvas.width / fontSize);
    const newRows = Math.floor(canvas.height / fontSize);
    
    // Создаем новую сетку с новыми размерами
    const newGrid = [];
    for (let x = 0; x < newColumns; x++) {
        newGrid[x] = [];
        for (let y = 0; y < newRows; y++) {
            if (x < matrixGrid.length && y < matrixGrid[x].length) {
                newGrid[x][y] = matrixGrid[x][y];
            } else {
                newGrid[x][y] = { char: getRandomChar(), opacity: 0 };
            }
        }
    }
    
    // Заменяем старую сетку
    for (let i = 0; i < newColumns; i++) {
        matrixGrid[i] = newGrid[i].slice(0, newRows);
    }
    matrixGrid.length = newColumns;
});

// Мобильная навигация
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Переключение активного состояния навигации
    nav.classList.toggle('active');
    
    // Анимация линий бургера
    burger.classList.toggle('toggle');
    
    // Анимация появления ссылок
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Скрытие меню при клике на ссылку в мобильной версии
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
            
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        }
    });
});

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Компенсация высоты хедера
                behavior: 'smooth'
            });
        }
    });
});

// Анимация бургера
function animateBurger() {
    const burgerTop = burger.querySelector('.line1');
    const burgerMiddle = burger.querySelector('.line2');
    const burgerBottom = burger.querySelector('.line3');
    
    burgerTop.classList.toggle('line1-active');
    burgerMiddle.classList.toggle('line2-active');
    burgerBottom.classList.toggle('line3-active');
}

burger.addEventListener('click', animateBurger);

// Эффект прилипания навигации
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 0);
});

// Обработка отправки формы
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получение данных формы
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Здесь можно добавить код для отправки данных на сервер
        // Например, с использованием fetch API
        
        // Временное сообщение об успешной отправке
        alert(`Спасибо, ${name}! Ваше сообщение отправлено.`);
        contactForm.reset();
    });
}

// Анимация появления элементов при скролле
const fadeElements = document.querySelectorAll('.project-card, .skill-category, .about-image, .about-text');

function checkFade() {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('fade-in');
        }
    });
}

// Проверка при загрузке и скролле
window.addEventListener('load', checkFade);
window.addEventListener('scroll', checkFade);

// Добавляем CSS для анимации
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0px);
        }
    }
    
    .line1-active {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .line2-active {
        opacity: 0;
    }
    
    .line3-active {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .sticky {
        background-color: rgba(18, 18, 18, 0.9) !important;
        box-shadow: 0 2px 10px rgba(0, 255, 0, 0.3) !important;
    }
    
    .project-card, .skill-category, .about-image, .about-text {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }

    /* Анимация мерцания символов */
    .matrix-char {
        animation: matrixFlash 2s infinite;
        animation-delay: var(--delay);
    }
`;
document.head.appendChild(styleSheet);

// Функция для переключения темы
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Проверяем сохраненную тему в localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    themeToggle.addEventListener('click', () => {
        // Переключаем класс темы на body
        document.body.classList.toggle('light-theme');
        
        // Меняем иконку
        if (document.body.classList.contains('light-theme')) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Анимация загрузки страницы
function addLoadingAnimation() {
    // Добавляем оверлей загрузки
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    
    const matrixLoader = document.createElement('div');
    matrixLoader.className = 'matrix-loader';
    matrixLoader.innerHTML = '<span>Загрузка</span>';
    
    loadingOverlay.appendChild(matrixLoader);
    document.body.appendChild(loadingOverlay);
    
    // Скрываем оверлей после загрузки страницы
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 1000);
        }, 1500);
    });
}

// Функция для кнопки прокрутки наверх
function setupScrollToTop() {
    const scrollButton = document.getElementById('scrollTop');
    
    // Показываем/скрываем кнопку в зависимости от положения скролла
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    // Прокрутка наверх при клике
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Функция для обработки скачивания резюме
function setupDownloadResume() {
    const downloadButton = document.getElementById('downloadCV');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Здесь должен быть путь к файлу резюме
            const resumePath = 'resume.pdf';
            
            // Создаем временную ссылку для скачивания
            const link = document.createElement('a');
            link.href = resumePath;
            link.download = 'Резюме.pdf';
            
            // Добавляем анимацию загрузки
            downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загружаю...';
            
            // Имитируем задержку (для демонстрации)
            setTimeout(() => {
                // Запускаем скачивание
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Возвращаем исходный текст кнопки
                downloadButton.innerHTML = '<i class="fas fa-download"></i> Скачать резюме';
                
                // Показываем уведомление
                showNotification('Скачивание началось!');
            }, 1500);
        });
    }
}

// Функция для показа уведомлений
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Добавляем функцию для поддержания матричного эффекта
function keepMatrixAlive() {
    // Добавляем периодическое обновление матрицы
    setInterval(() => {
        // Проверяем время с последнего движения мыши
        const timeSinceLastMove = Date.now() - lastMouseMoveTime;
        
        // Если курсор не двигался дольше 3 секунд
        if (timeSinceLastMove > 3000) {
            const cursorCellX = Math.floor(mouseX / fontSize);
            const cursorCellY = Math.floor(mouseY / fontSize);
            
            // Обновляем символы в последней позиции курсора
            updateMatrixAroundCursor(cursorCellX, cursorCellY);
            
            // Добавляем случайные вспышки вокруг последней позиции курсора
            const randomOffsetX = Math.floor(Math.random() * 10) - 5;
            const randomOffsetY = Math.floor(Math.random() * 10) - 5;
            
            updateMatrixAroundCursor(cursorCellX + randomOffsetX, cursorCellY + randomOffsetY);
        }
    }, 500); // Проверяем каждые 500мс
}

// Вызываем функцию для поддержания матричного эффекта
keepMatrixAlive();

// Расширяем инициализацию при загрузке
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    addLoadingAnimation();
    setupScrollToTop();
    setupDownloadResume();
});

// Добавляем стили для анимации загрузки
const loaderStyle = document.createElement('style');
loaderStyle.innerHTML = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--dark-color);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity 1s ease;
    }
    
    .matrix-loader {
        font-family: var(--matrix-font);
        font-size: 2rem;
        color: var(--primary-color);
        text-shadow: 0 0 10px var(--primary-color);
        position: relative;
    }
    
    .matrix-loader span:after {
        content: '...';
        position: absolute;
        animation: loadingDots 1.5s infinite;
    }
    
    @keyframes loadingDots {
        0% { content: '.'; }
        33% { content: '..'; }
        66% { content: '...'; }
        100% { content: '.'; }
    }
`;
document.head.appendChild(loaderStyle);

// Добавляем стили для уведомлений
const notificationStyle = document.createElement('style');
notificationStyle.innerHTML = `
    .notification {
        position: fixed;
        bottom: 30px;
        left: 30px;
        background-color: var(--primary-color);
        color: var(--dark-color);
        padding: 12px 25px;
        border-radius: 50px;
        font-family: var(--matrix-font);
        box-shadow: 0 0 15px var(--shadow-color);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.5s ease;
        z-index: 2000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyle); 