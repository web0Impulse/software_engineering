document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const inputs = document.querySelectorAll('.form-input');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('db-error');
    const passwordVisibleButton = document.getElementById('password-visible-button');

    // Добавляем обработчики для улучшения UX
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    // Обработка нажатия на кнопку видимости пароля
    passwordVisibleButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (passwordInput.type === "text") passwordInput.type = "password";
      else passwordInput.type = "text";
    });

    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        //Обнуление ошибок
        errorDiv.classList.remove('visible');
        errorDiv.innerHTML = "";
        // Сбор данных формы
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        // Проверка на пустые значения
        if (login == "") {
          errorDiv.classList.add('visible');
          errorDiv.innerHTML = "<p>Логин не может быть пустым</p>";
          return;
        }
        if (password == "") {
          errorDiv.classList.add('visible');
          errorDiv.innerHTML = "<p>Пароль не может быть пустым</p>";
          return;
        }
        // Отправка запроса
        const formData = {
            login: login,
            password: password
        };
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => {
          return response.json();
        })
        .then((json) => {
          if (json.status != 200) {
            errorDiv.classList.add('visible');
            errorDiv.innerHTML = json.message;
          } else if (json.status == 200) {
            errorDiv.classList.remove('visible');
            errorDiv.innerHTML = "";
            window.location.href = "/";
          }
        });
    });
});
