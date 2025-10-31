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
        // Сбор данных формы
        const loginInput = document.getElementById('login');
        const passwordInput = document.getElementById('password');
        const formData = {
            login: loginInput.value,
            password: passwordInput.value
        };
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => {
          return response.json();
        })
        .then((data) => {
            if (data.status == 404) {
            errorDiv.classList.add('visible');
            errorDiv.innerText = data.message;
          } else if (data.status == 500) {
            errorDiv.classList.add('visible');
            errorDiv.innerText = "Ошибка сервера. Попробуйте позже";
          } else {
            console.log(data);
          }
        });
    });
});
