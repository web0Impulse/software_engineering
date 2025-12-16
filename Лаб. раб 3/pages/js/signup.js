document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordMatchMessage = document.getElementById('passwordMatchMessage');
    const submitButton = document.getElementById('submitButton');
    const passwordVisibleButton = document.getElementById('password-visible-button');
    const confirmPasswordVisibleButton = document.getElementById('confirm-password-visible-button');
    const errorDiv = document.getElementById('dbError');

    // Функция проверки совпадения паролей
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password && confirmPassword && password !== confirmPassword) {
            passwordMatchMessage.classList.add('visible');
            confirmPasswordInput.style.borderColor = '#ff6b6b';
            submitButton.disabled = true;
        } else {
            passwordMatchMessage.classList.remove('visible');
            confirmPasswordInput.style.borderColor = password && confirmPassword ? '#3AAACF' : '#216278';
            submitButton.disabled = false;
        }
    }

    // Обработчики событий для полей паролей
    passwordInput.addEventListener('input', checkPasswordMatch);
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);

    // Функция добавления видимости полям паролей
    function setPasswordVisible(e){
      e.preventDefault();
      if (e.target === passwordVisibleButton) {
        if (passwordInput.type === "text") passwordInput.type = "password";
        else passwordInput.type = "text";
      } else if (e.target === confirmPasswordVisibleButton) {
        if (confirmPasswordInput.type === "text") confirmPasswordInput.type = "password";
        else confirmPasswordInput.type = "text";
      }
    }

    // Обработчики событий для кнопок видимости
    passwordVisibleButton.addEventListener('click', setPasswordVisible);
    confirmPasswordVisibleButton.addEventListener('click', setPasswordVisible);

    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorDiv.classList.remove('visible');
        errorDiv.innerHTML = "";

        // Поля формы
        const companyName = document.getElementById('company-name').value;
        const login = document.getElementById('login').value;
        const password = passwordInput.value;
        // Проверка совпадения паролей перед отправкой
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchMessage.classList.add('visible');
            confirmPasswordInput.focus();
            return;
        }
        // Проверка на пустые поля
        if (companyName == "") {
          errorDiv.classList.add('visible');
          errorDiv.innerHTML = "<p>Название компании не должно быть пустым</p>";
          return;
        }
        if (login == "") {
          errorDiv.classList.add('visible');
          errorDiv.innerHTML = "<p>Логин не должен быть пустым</p>";
          return;
        }
        if (password == "") {
          errorDiv.classList.add('visible');
          errorDiv.innerHTML = "<p>Пароль не должен быть пустым</p>";
          return;
        }
        // Сбор данных формы
        const formData = {
            company_name: companyName,
            login: login,
            password: password
        };
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => {
          return response.json();
        }).then((json) => {
          if (json.status != 201) {
            errorDiv.classList.add('visible');
            errorDiv.innerHTML = json.message;
          } else {
            errorDiv.classList.remove('visible');
            errorDiv.innerHTML = "";
            window.location.href = "/";
          }
        });

    });
});
