import express, { application } from "express"; // подключение express
import { body, param } from "express-validator"; // Подключение express-validator
import { MySQL_CONNECTION } from "./sql_connection.js"; // импорт подключения к бд
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { CompanyController } from "./controllers/company_controller.js";
import { PropertyController } from "./controllers/property_controller.js";
import { ShipController } from "./controllers/ship_controller.js";

// TODO: Добавить валидацию

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express(); // создаем объект приложения
const jsonParser = express.json();

// Настройка статических файлов css, js
app.use(express.static(__dirname + '/pages'));

// определяем обработчик для главной страницы
app.get("/", function(request, response){
    response.sendFile(__dirname + "/pages/main.html");
});

// test
app.get("/test", PropertyController.test);

// определяем обработчик для маршрута входа
app.get("/login", function(request, response){
    response.sendFile(__dirname + "/pages/login.html");
});
app.post("/login", jsonParser, CompanyController.login);

// определяем обработчик для маршрута регистрации
app.get("/signup", function(request, response){
    response.sendFile(__dirname + "/pages/signup.html");
});
app.post("/signup", jsonParser, CompanyController.create);

// api ship route
app.get("/api/ship/:id", [
  param('id').isInt().withMessage("ID должен быть числом"),
], ShipController.get);
app.post("/api/ship", jsonParser, [
  body("name")
    .notEmpty().withMessage("Имя корабля обязательно")
    .isLength({ max: 50 }).withMessage("Имя корабля должно быть не более 50 символов"),
  body("company_id")
    .isInt().withMessage("Company_ID должен быть числом")
], ShipController.create);
app.post("/api/ship/:id", jsonParser, [
  param("id").isInt().withMessage("ID должен быть числом"),
  body("name")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("company_id")
    .isInt().withMessage("company_id должен быть числом"),
  body("created_at")
    .isDate().withMessage("created_at должно быть датой"),
  body("updated_at")
    .isDate().withMessage("updated_at должно быть датой")  
], ShipController.update);
app.delete("/api/ship/:id", [
  param("id").isInt().withMessage("ID должен быть числом"),
], ShipController.delete);

// ответ по умолчанию
app.get("/*", function(request, response){
  response.sendFile(__dirname + "/pages/not_found.html");
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000, function(){
  console.log("Сервер запущен на порте 3000");
  MySQL_CONNECTION.connect(function(err){
     if (err) {
       return console.error("Ошибка: " + err.message);
     }
     else{
       console.log("Подключение к серверу MySQL успешно установлено");
     }
  });
});
