// Commit notes
// 1) Скрипты главной страницы

// Установка текущей даты
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = now.toLocaleDateString('ru-RU', options);

    // Обновление заголовка
    document.getElementById('pageTitle').textContent = `Освидетельствование имущества на ${formattedDate}`;

    // Обновление даты в футере
    document.getElementById('currentDate').textContent = formattedDate;

    // Добавление обработчиков для кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const itemName = row.cells[0].textContent;
            alert(`Просмотр деталей для: ${itemName}`);
        });
    });

    // Обработчики для сворачивания/разворачивания таблиц
    const assetTypeHeaders = document.querySelectorAll('.asset-type');
    assetTypeHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const container = this.closest('.table-container');
            container.classList.toggle('collapsed');
            this.classList.toggle('collapsed');
        });
    });

    // Обработчик для поиска по типам
    const goButton = document.getElementById('goButton');
    const typeSearch = document.getElementById('typeSearch');

    goButton.addEventListener('click', function() {
        const searchValue = typeSearch.value.trim();
        if (!searchValue) return;

        // Поиск соответствующего раздела
        const targetHeader = document.querySelector(`.asset-type[data-type="${searchValue}"]`);

        if (targetHeader) {
            // Прокрутка к найденному разделу
            targetHeader.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Подсветка найденного раздела
            targetHeader.classList.add('highlighted');

            // Разворачивание таблицы, если она свернута
            const container = targetHeader.closest('.table-container');
            container.classList.remove('collapsed');
            targetHeader.classList.remove('collapsed');

            // Удаление подсветки через 2 секунды
            setTimeout(() => {
                targetHeader.classList.remove('highlighted');
            }, 2000);
        } else {
            alert('Раздел с таким типом имущества не найден');
        }
    });

    // Поиск при нажатии Enter в поле ввода
    typeSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            goButton.click();
        }
    });
});
