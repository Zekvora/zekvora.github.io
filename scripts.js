document.addEventListener('DOMContentLoaded', () => {
    // Элементы для блокировки
    const blockOverlay = document.getElementById('blockOverlay');
    const blockTimer = document.getElementById('blockTimer');

    // Функция для обновления текста в зависимости от языка
    function updateBlockMessage() {
        const lang = localStorage.getItem('language') || 'ru';
        const message = blockOverlay.querySelector('p');
        message.textContent = lang === 'ru'
            ? "Пожалуйста, не обновляйте страницу так часто. Это может навредить работе сайта."
            : "Please do not refresh the page so often. This may harm the site's performance.";
    }

    // Проверка блокировки при загрузке страницы
    const isBlocked = localStorage.getItem('isBlocked') === 'true';
    const blockEndTime = parseInt(localStorage.getItem('blockEndTime')) || 0;
    const now = Date.now();

    if (isBlocked && blockEndTime > now) {
        // Если пользователь заблокирован, показываем оверлей
        blockOverlay.classList.add('active');
        updateBlockMessage();

        // Обновляем таймер
        const remainingTime = Math.ceil((blockEndTime - now) / 1000);
        blockTimer.textContent = remainingTime;

        const timerInterval = setInterval(() => {
            const timeLeft = Math.ceil((blockEndTime - Date.now()) / 1000);
            blockTimer.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                blockOverlay.classList.remove('active');
                localStorage.removeItem('isBlocked');
                localStorage.removeItem('blockEndTime');
                localStorage.removeItem('refreshCount');
                localStorage.removeItem('firstRefreshTime');
            }
        }, 1000);
    } else {
        // Сбрасываем блокировку, если время истекло
        localStorage.removeItem('isBlocked');
        localStorage.removeItem('blockEndTime');
    }

    // Отслеживание обновлений
    if (!isBlocked) {
        const refreshCount = parseInt(localStorage.getItem('refreshCount')) || 0;
        const firstRefreshTime = parseInt(localStorage.getItem('firstRefreshTime')) || now;

        // Обновляем счётчик и время
        localStorage.setItem('refreshCount', refreshCount + 1);
        if (refreshCount === 0) {
            localStorage.setItem('firstRefreshTime', now);
        }

        // Проверяем, прошло ли 10 секунд
        const timeElapsed = (now - firstRefreshTime) / 1000; // Время в секундах
        const currentCount = parseInt(localStorage.getItem('refreshCount'));

        if (timeElapsed <= 10 && currentCount > 15) {
            // Блокируем пользователя на 30 секунд
            const blockDuration = 30 * 1000; // 30 секунд в миллисекундах
            localStorage.setItem('isBlocked', 'true');
            localStorage.setItem('blockEndTime', now + blockDuration);

            // Показываем оверлей
            blockOverlay.classList.add('active');
            updateBlockMessage();

            // Запускаем таймер
            blockTimer.textContent = 30;
            const timerInterval = setInterval(() => {
                const timeLeft = Math.ceil((parseInt(localStorage.getItem('blockEndTime')) - Date.now()) / 1000);
                blockTimer.textContent = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    blockOverlay.classList.remove('active');
                    localStorage.removeItem('isBlocked');
                    localStorage.removeItem('blockEndTime');
                    localStorage.removeItem('refreshCount');
                    localStorage.removeItem('firstRefreshTime');
                }
            }, 1000);
        } else if (timeElapsed > 10) {
            // Сбрасываем счётчик, если прошло больше 10 секунд
            localStorage.setItem('refreshCount', 1);
            localStorage.setItem('firstRefreshTime', now);
        }
    }

    // Остальной код (переключение темы, языка, редактор и т.д.) остаётся без изменений
    const runButton = document.getElementById('runButton');
    const htmlInput = document.getElementById('htmlInput');
    const cssInput = document.getElementById('cssInput');
    const jsInput = document.getElementById('jsInput');
    const output = document.getElementById('output');
    const errorMessage = document.getElementById('error-message');
    const themeToggle = document.getElementById('themeToggle');
    const langRu = document.getElementById('langRu');
    const langEn = document.getElementById('langEn');

    // ... (остальной код без изменений)
});

document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('runButton');
    const htmlInput = document.getElementById('htmlInput');
    const cssInput = document.getElementById('cssInput');
    const jsInput = document.getElementById('jsInput');
    const output = document.getElementById('output');
    const errorMessage = document.getElementById('error-message');
    const themeToggle = document.getElementById('themeToggle');
    const langRu = document.getElementById('langRu');
    const langEn = document.getElementById('langEn');

    // Восстановление темы из localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
    } else {
        document.body.classList.remove('light-theme');
        if (themeToggle) themeToggle.textContent = '☀️';
    }

    // Переключение темы
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
    }

    // Переключение языка
    function setLanguage(lang) {
        document.querySelectorAll('[data-ru][data-en]').forEach(element => {
            element.textContent = element.getAttribute(`data-${lang}`);
        });
        document.documentElement.lang = lang === 'ru' ? 'ru' : 'en';

        // Обновление класса active для кнопок
        if (lang === 'ru') {
            langRu.classList.add('active');
            langEn.classList.remove('active');
        } else {
            langEn.classList.add('active');
            langRu.classList.remove('active');
        }

        // Обновление плейсхолдеров только для index.html
        if (htmlInput && cssInput && jsInput) {
            if (lang === 'ru') {
                htmlInput.placeholder = 'Вставьте HTML сюда...';
                cssInput.placeholder = 'Вставьте CSS сюда...';
                jsInput.placeholder = 'Вставьте JS сюда...';
            } else {
                htmlInput.placeholder = 'Paste HTML here...';
                cssInput.placeholder = 'Paste CSS here...';
                jsInput.placeholder = 'Paste JS here...';
            }
        }

        // Сохранение языка в localStorage
        localStorage.setItem('language', lang);
    }

    // Восстановление языка из localStorage
    const savedLanguage = localStorage.getItem('language') || 'ru'; // По умолчанию 'ru', если ничего не сохранено
    if (langRu && langEn) {
        setLanguage(savedLanguage);
        langRu.addEventListener('click', () => setLanguage('ru'));
        langEn.addEventListener('click', () => setLanguage('en'));
    }

    // Логика редактора (только для index.html)
    if (runButton && htmlInput && cssInput && jsInput && output && errorMessage) {
        console.log("Все элементы редактора найдены, скрипт готов");

        runButton.addEventListener('click', () => {
            console.log("Кнопка 'Показать результат' нажата");
            const html = htmlInput.value.trim();
            console.log("HTML введённый:", `'${html}'`);

            if (!html) {
                console.log("HTML пустой, показываем сообщение об ошибке");
                errorMessage.textContent = document.documentElement.lang === 'ru' ? "Вы ничего не ввели в HTML" : "You didn't enter anything in HTML";
                errorMessage.classList.add('show');
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                    console.log("Сообщение об ошибке скрыто через 5 секунд");
                }, 5000);
                return;
            }

            console.log("HTML не пустой, обновляем iframe");
            const css = cssInput.value || '';
            const js = jsInput.value || '';
            const content = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            background: #2a2a40;
                            color: #e0e0e0;
                            font-family: 'Roboto', sans-serif;
                            margin: 0;
                            padding: 20px;
                            overflow: auto;
                            box-sizing: border-box;
                        }
                        ::-webkit-scrollbar {
                            width: 10px;
                            height: 10px;
                        }
                        ::-webkit-scrollbar-track {
                            background: #3a3a55;
                            border-radius: 10px;
                        }
                        ::-webkit-scrollbar-thumb {
                            background: #00d4ff;
                            border-radius: 10px;
                            box-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
                        }
                        ::-webkit-scrollbar-thumb:hover {
                            background: #007bff;
                        }
                        ${css}
                    </style>
                </head>
                <body>
                    ${html}
                    <script>${js}<\/script>
                </body>
                </html>
            `;

            try {
                console.log("Попытка обновить iframe");
                const blob = new Blob([content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                output.src = url;
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                console.log("iframe успешно обновлён");
            } catch (error) {
                console.error("Ошибка при обновлении iframe:", error);
                output.srcdoc = '<p style="color: #ff4081;">Ошибка. Проверьте консоль (F12).</p>';
            }
        });
    }
});
