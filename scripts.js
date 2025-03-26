document.addEventListener('DOMContentLoaded', () => {
    // Элементы редактора
    const runButton = document.getElementById('runButton');
    const htmlInput = document.getElementById('htmlInput');
    const cssInput = document.getElementById('cssInput');
    const jsInput = document.getElementById('jsInput');
    const output = document.getElementById('output');
    const errorMessage = document.getElementById('error-message');
    const themeToggle = document.getElementById('themeToggle');
    const langRu = document.getElementById('langRu');
    const langEn = document.getElementById('langEn');

    // Элементы загрузки файлов
    const htmlFileInput = document.getElementById('htmlFileInput');
    const htmlUploadBtn = document.getElementById('htmlUploadBtn');
    const imageFileInput = document.getElementById('imageFileInput');
    const imageUploadBtn = document.getElementById('imageUploadBtn');
    const cssFileInput = document.getElementById('cssFileInput');
    const cssUploadBtn = document.getElementById('cssUploadBtn');
    const jsFileInput = document.getElementById('jsFileInput');
    const jsUploadBtn = document.getElementById('jsUploadBtn');
    const mediaList = document.getElementById('mediaList');

    // Кнопки копирования
    const htmlCopyBtn = document.getElementById('htmlCopyBtn');
    const cssCopyBtn = document.getElementById('cssCopyBtn');
    const jsCopyBtn = document.getElementById('jsCopyBtn');

    // Объект для хранения загруженных файлов и счетчик изображений
    let uploadedFiles = {};
    let imageCounter = 0;

    // Очистка файлов при обновлении страницы
    window.addEventListener('beforeunload', () => {
        for (const file of Object.values(uploadedFiles)) {
            if (file.url) URL.revokeObjectURL(file.url);
        }
    });

    // Восстановление темы
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

        if (lang === 'ru') {
            langRu.classList.add('active');
            langEn.classList.remove('active');
        } else {
            langEn.classList.add('active');
            langRu.classList.remove('active');
        }

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

        localStorage.setItem('language', lang);
    }

    const savedLanguage = localStorage.getItem('language') || 'ru';
    if (langRu && langEn) {
        setLanguage(savedLanguage);
        langRu.addEventListener('click', () => setLanguage('ru'));
        langEn.addEventListener('click', () => setLanguage('en'));
    }

    // Функция для обработки загрузки файлов
    function handleFileUpload(input, button, targetTextarea, acceptType, isImage = false) {
        button.addEventListener('click', () => input.click());

        input.addEventListener('change', () => {
            const files = Array.from(input.files);
            files.forEach(file => {
                const reader = new FileReader();
                let fileId;

                if (isImage) {
                    imageCounter++;
                    fileId = `media://photo-${imageCounter}`;
                } else {
                    fileId = `${Date.now()}-${file.name}`;
                }

                reader.onload = (e) => {
                    uploadedFiles[fileId] = {
                        name: file.name,
                        data: e.target.result,
                        type: file.type,
                        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
                    };

                    if (isImage) {
                        targetTextarea.value += `\n<img src="${fileId}" alt="${file.name}">`;
                    } else if (file.type === acceptType) {
                        targetTextarea.value += `\n${e.target.result}`;
                    }

                    const mediaItem = document.createElement('div');
                    mediaItem.className = 'media-item';

                    if (file.type.startsWith('image/')) {
                        const img = document.createElement('img');
                        img.src = uploadedFiles[fileId].url;
                        mediaItem.appendChild(img);
                    }

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = `${file.name} (ID: ${fileId})`;
                    mediaItem.appendChild(nameSpan);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = savedLanguage === 'ru' ? 'Удалить' : 'Delete';
                    deleteBtn.addEventListener('click', () => {
                        delete uploadedFiles[fileId];
                        mediaItem.remove();
                        if (file.type.startsWith('image/')) {
                            URL.revokeObjectURL(uploadedFiles[fileId].url);
                        }
                    });
                    mediaItem.appendChild(deleteBtn);

                    mediaList.appendChild(mediaItem);
                };

                if (file.type.startsWith('image/')) {
                    reader.readAsDataURL(file);
                } else {
                    reader.readAsText(file);
                }
            });
            input.value = '';
        });
    }

    // Привязываем загрузку к каждой кнопке
    if (htmlFileInput && htmlUploadBtn) {
        handleFileUpload(htmlFileInput, htmlUploadBtn, htmlInput, 'text/html');
    }
    if (imageFileInput && imageUploadBtn) {
        handleFileUpload(imageFileInput, imageUploadBtn, htmlInput, 'image/*', true);
    }
    if (cssFileInput && cssUploadBtn) {
        handleFileUpload(cssFileInput, cssUploadBtn, cssInput, 'text/css');
    }
    if (jsFileInput && jsUploadBtn) {
        handleFileUpload(jsFileInput, jsUploadBtn, jsInput, 'text/javascript');
    }

    // Функция копирования текста
    function copyToClipboard(textarea, button) {
        button.addEventListener('click', () => {
            const text = textarea.value;
            navigator.clipboard.writeText(text).then(() => {
                // Визуальная обратная связь
                button.textContent = savedLanguage === 'ru' ? '❐!' : '❐!';
                setTimeout(() => {
                    button.textContent = savedLanguage === 'ru' ? '❐' : '❐';
                }, 2000);
            }).catch(err => {
                console.error('Ошибка копирования:', err);
                errorMessage.textContent = savedLanguage === 'ru' ? 'Ошибка при копировании' : 'Copy error';
                errorMessage.classList.add('show');
                setTimeout(() => errorMessage.classList.remove('show'), 5000);
            });
        });
    }

    // Привязываем копирование к каждой кнопке
    if (htmlCopyBtn) copyToClipboard(htmlInput, htmlCopyBtn);
    if (cssCopyBtn) copyToClipboard(cssInput, cssCopyBtn);
    if (jsCopyBtn) copyToClipboard(jsInput, jsCopyBtn);

    // Логика редактора
    if (runButton && htmlInput && cssInput && jsInput && output && errorMessage) {
        runButton.addEventListener('click', () => {
            const html = htmlInput.value.trim();
            if (!html) {
                errorMessage.textContent = document.documentElement.lang === 'ru' ? "Вы ничего не ввели в HTML" : "You didn't enter anything in HTML";
                errorMessage.classList.add('show');
                setTimeout(() => errorMessage.classList.remove('show'), 5000);
                return;
            }

            const css = cssInput.value || '';
            const js = jsInput.value || '';

            let processedHtml = html;
            for (const [id, file] of Object.entries(uploadedFiles)) {
                if (file.type.startsWith('image/')) {
                    processedHtml = processedHtml.replaceAll(id, file.url);
                }
            }

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
                    ${processedHtml}
                    <script>${js}<\/script>
                </body>
                </html>
            `;

            try {
                const blob = new Blob([content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                output.src = url;
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (error) {
                console.error("Ошибка при обновлении iframe:", error);
                output.srcdoc = '<p style="color: #ff4081;">Ошибка. Проверьте консоль (F12).</p>';
            }
        });
    }
});
