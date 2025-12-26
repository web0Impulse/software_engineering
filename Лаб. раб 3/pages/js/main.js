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
    // const goButton = document.getElementById('goButton');
    // const typeSearch = document.getElementById('typeSearch');

    // goButton.addEventListener('click', function() {
    //     const searchValue = typeSearch.value.trim();
    //     if (!searchValue) return;

    //     // Поиск соответствующего раздела
    //     const targetHeader = document.querySelector(`.asset-type[data-type="${searchValue}"]`);

    //     if (targetHeader) {
    //         // Прокрутка к найденному разделу
    //         targetHeader.scrollIntoView({
    //             behavior: 'smooth',
    //             block: 'start'
    //         });

    //         // Подсветка найденного раздела
    //         targetHeader.classList.add('highlighted');

    //         // Разворачивание таблицы, если она свернута
    //         const container = targetHeader.closest('.table-container');
    //         container.classList.remove('collapsed');
    //         targetHeader.classList.remove('collapsed');

    //         // Удаление подсветки через 2 секунды
    //         setTimeout(() => {
    //             targetHeader.classList.remove('highlighted');
    //         }, 2000);
    //     } else {
    //         alert('Раздел с таким типом имущества не найден');
    //     }
    // });

    // Поиск при нажатии Enter в поле ввода
    // typeSearch.addEventListener('keypress', function(e) {
    //     if (e.key === 'Enter') {
    //         goButton.click();
    //     }
    // });

    /* Обработка модального окна создания корабля */
    const addShipModalButton = document.getElementById('addShipModalButton');
    const closeShipModalButton = document.getElementById('closeShipModalButton');
    const closeShipModalSign = document.getElementById('closeShipModalSign');
    const addShipModal = document.getElementById('addShipModal');
    const shipNameInput = document.getElementById("shipName");
    const addShipModalErrDiv = document.getElementById('addShipSubmitError');
    
    // Обработка нажатия на кнопку открытия модального окна добавления корабля
    addShipModalButton.addEventListener('click', () => {
        addShipModal.classList.remove('hidden');
    });
    // Обработка нажатия на кнопку закрытия модального окна добавления корабля
    closeShipModalButton.addEventListener('click', (e) => {
        e.preventDefault();
        addShipModal.classList.add('hidden');
        shipNameInput.value = "";
    });
    closeShipModalSign.addEventListener('click', () => {
        addShipModal.classList.add('hidden');
        shipNameInput.value = "";
    });
    // Закрыть при клике вне окна
    window.addEventListener('click', (event) => {
        if (event.target === addShipModal) {
            addShipModal.classList.add('hidden');
            shipNameInput.value = "";
        }
    });
    // Обработка отправки формы
    addShipModal.addEventListener('submit', function(e) {
        e.preventDefault();
        // Сбор данных формы
        const data = {
            name: shipNameInput.value
        }
        fetch('/api/ship', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((result) => {
            return result.json();
        })
        .then((json) => {
            // Вывести ошибки
            if (json.status != 201) {
                addShipModalErrDiv.classList.add('visible');
                addShipModalErrDiv.innerHTML = json.message;
            } else {
                // Закрыть окно
                addShipModal.classList.add('hidden');
                // Очистить форму
                shipNameInput.value = "";
            }
        })
        .catch(err => {
            // Вывести ошибки
            addShipModalErrDiv.classList.add('visible');
            addShipModalErrDiv.innerHTML = "Необработанная ошибка. См. консоль";
            console.log(err);
        })
    });

    /* Обработка модального окна добавления имущества */
    const addPropertyModal = document.getElementById('addPropertyModal');
    const addPropertyForm = document.getElementById('addPropertyForm');
    const addPropertyModalButton = document.getElementById('addPropertyButton');
    const closePropertyModalButton = document.getElementById('closePropertyModalButton');
    const closePropertyModalSign = document.getElementById('closeAddPropertyModalSign');
    const propertyNameInput = document.getElementById('propertyName');
    const typeIdSelect = document.getElementById('propertyType');
    const shipIdSelect = document.getElementById('ship');
    const quantityInput = document.getElementById('quantity');
    const locationInput = document.getElementById('location');
    const datePrevInspectionInput = document.getElementById('prevInspectionDate');
    const checkedMarkCheckbox = document.getElementById('checkMark');
    const frequencyOfInspectionInput = document.getElementById('frequencyOfInspection');
    const isOkCheckbox = document.getElementById('isOk');
    const addPropertyModalErrDiv = document.getElementById('addPropertySubmitError');

    // Обработка нажатия на кнопку открытия модального окна добавления имущества
    addPropertyModalButton.addEventListener('click', () => {
        addPropertyModal.classList.remove('hidden');
    });
    
    // Обработка нажатия на кнопку закрытия модального окна добавления имущества
    closePropertyModalButton.addEventListener('click', (e) => {
        e.preventDefault();
        addPropertyModal.classList.add('hidden');
        addPropertyForm.reset();
    });

    closePropertyModalSign.addEventListener('click', () => {
        addPropertyModal.classList.add('hidden');
        addPropertyForm.reset();
    });

    // Закрыть при клике вне окна
    window.addEventListener('click', (event) => {
        if (event.target === addPropertyModal) {
            addPropertyModal.classList.add('hidden');
            addPropertyForm.reset();
        }
    });

    // // Обработка отправки формы
    addPropertyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const d = new Date();
        // Сбор данных формы
        const data = {
            name: propertyNameInput.value,
            type_id: parseInt(typeIdSelect.value),
            ship_id: parseInt(shipIdSelect.value),
            quantity: parseInt(quantityInput.value),
            location: locationInput.value,
            date_prev_inspection: datePrevInspectionInput.value,
            check_mark: checkedMarkCheckbox.checked,
            frequency_of_inspection: parseInt(frequencyOfInspectionInput.value),
            is_ok: isOkCheckbox.checked
        }
        fetch('/api/property', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((result) => {
            return result.json();
        })
        .then((json) => {
            // Вывести ошибки
            if (json.status != 201) {
                addPropertyModalErrDiv.classList.add('visible');
                addPropertyModalErrDiv.innerHTML = json.message;
            } else {
                window.location.reload();
            }
        })
        .catch(err => {
            // Вывести ошибки
            addPropertyModalErrDiv.classList.add('visible');
            addPropertyModalErrDiv.innerHTML = "Необработанная ошибка. См. консоль";
            console.log(err);
        });
    });


    // Обработка нажатия на кнопку выхода
    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            return response.json();
        })
        .then((json) => {
          if (json.status != 200) {
            console.log(json.message);
          } else {
            window.location.href = '/login';
          }
        });
    })
});
