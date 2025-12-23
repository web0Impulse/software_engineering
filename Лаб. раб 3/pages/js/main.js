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

    /* Обработка модального окна создания корабля */
    const addShipModalButton = document.getElementById('addShipModalButton');
    const closeShipModalButton = document.getElementById('closeShipModalButton');
    const closeShipModalSign = document.getElementById('closeShipModalSign')
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

    /* Обработка модального окна */
    // const openBtn = document.getElementById('addPropertyButton');
    // const modal = document.getElementById('assetModal');
    // const modalForm = document.getElementById('assetForm');
    // const closeBtn = document.getElementById('closeModal');
    // const cancelBtn = document.getElementById('cancelButton');
    
    // const nameInput = document.getElementById("name");
    // const typeIdSelect = document.getElementById("type");
    // const quantityInput = document.getElementById("quantity");
    // const locationInput = document.getElementById("location");
    // const datePrevInspectionInput = document.getElementById("inspectionDate");
    // const checkedMarkCheckbox = document.getElementById("completed");
    // const frequencyOfInspectionInput = document.getElementById("period");
    // const isOkCheckbox = document.getElementById("result");

    // openBtn.addEventListener('click', () => {
    //     modal.classList.remove('hidden');
    //     if (typeIdSelect.value == "NULL") {
    //         quantityInput.attributes.removeNamedItem("required");
    //         locationInput.attributes.removeNamedItem("required");
    //         datePrevInspectionInput.attributes.removeNamedItem("required");
    //         frequencyOfInspectionInput.attributes.removeNamedItem("required");
    //     }
    //     else {
    //         quantityInput.required = true;
    //         quantityInput.required = true;
    //         locationInput.required = true;
    //         datePrevInspectionInput.required = true;
    //         frequencyOfInspectionInput.required = true;
    //     }
    // });

    // closeBtn.addEventListener('click', () => {
    //     modal.classList.add('hidden');
    // });

    // cancelBtn.addEventListener('click', () => {
    //     modal.classList.add('hidden');
    // });

    // Закрыть при клике вне окна
    // window.addEventListener('click', (event) => {
    //     if (event.target === modal) {
    //     modal.classList.add('hidden');
    //     }
    // });
    // Проверка на то является ли тип родительским
    // typeIdSelect.addEventListener('change', function(e) {
    //     if (typeIdSelect.value == "NULL") {
    //         quantityInput.attributes.removeNamedItem("required");
    //         locationInput.attributes.removeNamedItem("required");
    //         datePrevInspectionInput.attributes.removeNamedItem("required");
    //         frequencyOfInspectionInput.attributes.removeNamedItem("required");
    //     }
    //     else {
    //         quantityInput.required = true;
    //         quantityInput.required = true;
    //         locationInput.required = true;
    //         datePrevInspectionInput.required = true;
    //         frequencyOfInspectionInput.required = true;
    //     }
    // });

    // // Обработка отправки формы
    // modalForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const d = new Date();
    //     // Сбор данных формы
    //     const data = {
    //         name: nameInput.value,
    //         type_id: parseInt(typeIdSelect.value) || 0,
    //         quantity: parseInt(quantityInput.value) || 0,
    //         location: locationInput.value,
    //         date_prev_inspection: datePrevInspectionInput.value || d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(),
    //         check_mark: checkedMarkCheckbox.checked,
    //         frequency_of_inspection: frequencyOfInspectionInput.value * 365,
    //         is_ok: isOkCheckbox.checked
    //     }
    //     fetch('/api/property', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(data)
    //     })
    //     .then((result) => {
    //         quantityInput.required = true;
    //         quantityInput.required = true;
    //         locationInput.required = true;
    //         datePrevInspectionInput.required = true;
    //         frequencyOfInspectionInput.required = true;
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    //     // Закрыть окно
    //     modal.classList.add('hidden');
    //     // Очистить форму при необходимости
    //     this.reset();
    // });


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
