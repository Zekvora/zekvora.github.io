document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('runButton');
    const htmlInput = document.getElementById('htmlInput');
    const cssInput = document.getElementById('cssInput');
    const jsInput = document.getElementById('jsInput');
    const output = document.getElementById('output');
    const errorMessage = document.getElementById('error-message');
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        // Переключение темы работает на всех страницах
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
        });
    }

    // Логика редактора только для главной страницы
    if (runButton && htmlInput && cssInput && jsInput && output && errorMessage) {
        console.log("Все элементы редактора найдены, скрипт готов");

        runButton.addEventListener('click', () => {
            console.log("Кнопка 'Показать результат' нажата");
            const html = htmlInput.value.trim();
            console.log("HTML введённый:", `'${html}'`);

            if (!html) {
                console.log("HTML пустой, показываем сообщение об ошибке");
                errorMessage.textContent = "Вы ничего не ввели в HTML";
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
                            background: #2e2e45;
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
                            background: #1a1a2e;
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
