import express, { application } from "express"; // подключение express
import { body, param } from "express-validator"; // Подключение express-validator
import { MySQL_CONNECTION } from "./sql_connection.js"; // импорт подключения к бд
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { CompanyController } from "./controllers/company_controller.js";
import { PropertyController } from "./controllers/property_controller.js";
import { ShipController } from "./controllers/ship_controller.js";
import { PropertyTypeController } from "./controllers/property_type_controller.js";

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
//app.get("/test", PropertyController.test);

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
    .notEmpty().withMessage("name обязательно")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("company_id")
    .notEmpty().withMessage("company_id должно быть числом")
    .isInt().withMessage("Company_ID должен быть числом")
], ShipController.create);
app.post("/api/ship/:id", jsonParser, [
  param("id").isInt().withMessage("ID должен быть числом"),
  body("name")
    .optional()
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("company_id")
    .optional()
    .isInt().withMessage("company_id должен быть числом"),
  body("created_at")
    .optional()
    .isISO8601().withMessage("created_at должно быть датой"),
  body("updated_at")
    .optional()
    .isISO8601().withMessage("updated_at должно быть датой")  
], ShipController.update);
app.delete("/api/ship/:id", [
  param("id").isInt().withMessage("ID должен быть числом"),
], ShipController.delete);

// api property route
app.get("/api/property/:id", [
  param("id").isInt().withMessage("ID должен быть числом")
], PropertyController.get);
app.post("/api/property", jsonParser, [
  body("name")
    .isString().withMessage("name должно быть строкой")
    .notEmpty().withMessage("name обязательно")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("type_id")
    .isInt().withMessage("type_id должно быть числом"),
  body("quantity")
    .isInt().withMessage("quantity должно быть числом"),
  body("location")
    .optional()
    .isLength({ max: 50 }).withMessage("location должно быть не более 50 символов"),
  body("date_prev_inspection")
    .isISO8601().withMessage("date_prev_inspection должно быть датой"),
  body("frequency_of_inspection")
    .isInt({ min: 0, max: 159000000000 }).withMessage("frequency_of_inspection должно быть числом"),
  body("check_mark")
    .isBoolean().withMessage("check_mark должно быть булевым значением"),
  body("is_ok")
    .isBoolean().withMessage("is_ok должно быть булевым значением")
], PropertyController.create);
app.post("/api/property/:id", jsonParser, [
  param("id").isInt().withMessage("ID должен быть числом"),
  body("name")
    .optional()
    .isString().withMessage("name должно быть строкой")
    .notEmpty().withMessage("name обязательно")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("type_id")
    .optional()
    .isInt().withMessage("type_id должно быть числом"),
  body("quantity")
    .optional()
    .isInt().withMessage("quantity должно быть числом"),
  body("location")
    .optional()
    .isLength({ max: 50 }).withMessage("location должно быть не более 50 символов"),
  body("date_prev_inspection")
    .optional()
    .isISO8601().withMessage("date_prev_inspection должно быть датой"),
  body("frequency_of_inspection")
    .optional()
    .isInt({ min: 0, max: 159000000000 }).withMessage("frequency_of_inspection должно быть числом"),
  body("check_mark")
    .optional()
    .isBoolean().withMessage("check_mark должно быть булевым значением"),
  body("is_ok")
    .optional()
    .isBoolean().withMessage("is_ok должно быть булевым значением")
], PropertyController.update);
app.delete("/api/property/:id", [
  param("id").isInt().withMessage("ID должен быть числом"),
], PropertyController.delete);

// api property type route
app.get("/api/propertyType/:id", [
  param('id').isInt().withMessage("ID должен быть числом"),
], PropertyTypeController.get);
app.post("/api/propertyType", jsonParser, [
  body("name")
    .notEmpty().withMessage("name обязательно")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("parent_id")
    .optional()
    .isInt().withMessage("parent_id должен быть числом")
], PropertyTypeController.create);
app.post("/api/propertyType/:id", jsonParser, [
  param("id").isInt().withMessage("ID должен быть числом"),
  body("name")
    .optional()
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("parent_id")
    .optional()
    .isInt().withMessage("parent_id должен быть числом"),
  body("created_at")
    .optional()
    .isISO8601().withMessage("created_at должно быть датой"),
  body("updated_at")
    .optional()
    .isISO8601().withMessage("updated_at должно быть датой")  
], PropertyTypeController.update);
app.delete("/api/propertyType/:id", [
  param("id").isInt().withMessage("ID должен быть числом"),
], PropertyTypeController.delete);

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
