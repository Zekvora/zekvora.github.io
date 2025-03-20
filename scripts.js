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
