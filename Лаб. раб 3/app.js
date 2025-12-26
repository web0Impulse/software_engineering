import express, { application } from "express"; // подключение express
import session from "express-session"; // подключение express сессий
import { body, param } from "express-validator"; // Подключение express-validator
import { MySQL_CONNECTION } from "./sql_connection.js"; // импорт подключения к бд
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { CompanyController } from "./controllers/company_controller.js";
import { PropertyController } from "./controllers/property_controller.js";
import { ShipController } from "./controllers/ship_controller.js";
import { PropertyTypeController } from "./controllers/property_type_controller.js";
import { checkAuth } from "./middleware/auth.js";
import hbs from 'hbs';
import { Property } from "./models/property_model.js";
import { Ship } from "./models/ship_model.js";
import { PropertyType } from "./models/property_type_model.js";
import { databaseErrorHandler } from "./handlers/error_handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express(); // создаем объект приложения
const jsonParser = express.json();

// Настройка статических файлов css, js
app.use(express.static(__dirname + '/pages'));
// Настройка сессий
app.use(session({
  secret: 'uha870y7rehunjadfs7uyh', // секрет для подписи сессий
  resave: false, // не сохранять сессию, если она не изменилась
  saveUninitialized: false, // не сохранять "пустую" сессию
  cookie: { maxAge: 36 * 60 * 60 * 1000 } // время жизни cookie (36 часов)
}));
app.use(checkAuth);


// определяем обработчик для главной страницы
app.get("/", function(request, response){
    const property = new Property();
    // ВОТ ТУТ БЫ ПРИГОДИЛСЯ JOIN
    const ship = new Ship();
    const propertyType = new PropertyType();
    // Получение всех кораблей компании
    ship.getAll("WHERE company_id = ?", [request.session.user.id])
      .then(() => {
        // Получение всех типов имущества компании
        return propertyType.getAll("WHERE company_id = ?", [request.session.user.id])
                  .then(() => {
                    // Получение всего имущества принадлежащего компании
                    return property.getAll("WHERE ship_id IN (?)", [ship.values.map(obj => obj.id)])
                              .then(() => {
                                property.values.forEach((prop) => {
                                  // Преобразование данных
                                  if (prop.is_ok) { prop.is_ok = "ОК" }
                                  else {prop.is_ok = "ОК"};
                                  if (prop.check_mark) { prop.check_mark = "Проверено" }
                                  else {prop.check_mark = "Не проверено"};
                                  prop.frequency_of_inspection = prop.frequency_of_inspection / 1000 / 60 / 60 / 24;
                                  // Внедрение корабля
                                  prop.ship = ship.values.find(obj => obj.id === prop.ship_id);
                                  // Внедрение типа имущества
                                  prop.type = propertyType.values.find(obj => obj.id === prop.type_id);
                                });
                                return response.render("index.hbs", {
                                  property: property.values,
                                  ships: ship.values,
                                  propTypes: propertyType.values
                                });
                              });
                  });
      })
      .catch((err) => {
        databaseErrorHandler(err, response);
      });
});

// test
//app.get("/test", PropertyController.test);

// 1. Маршруты для авторизации
// правила валидации авторизации
const loginValidationRules = [
  body("login")
    .notEmpty().withMessage("Логин не должен быть пустым")
    .isString().withMessage("Логин должен быть строкой")
    .isLength({ max: 50 }).withMessage("Длина логина не должна превышать 50 символов"),
  body("password")
    .notEmpty().withMessage("Пароль не должен быть пустым")
    .isString().withMessage("Пароль должен быть строкой")
];
// Страница авторизации
app.get("/login", function(_, response){
    response.sendFile(__dirname + "/pages/login.html");
});
// Маршрут логики авторизции
app.post("/api/login", jsonParser, loginValidationRules, CompanyController.login);

// 2. Маршруты для регистрации
// Правила валидации регистрации
let signupValidationRules = [
  body("company_name")
    .notEmpty().withMessage("Название компании не должно быть пустым")
    .isString().withMessage("Название компании должно быть строкой")
    .isLength({ max: 50 }).withMessage("Длина названия компании не должна превышать 50 символов"),
  body("login")
    .notEmpty().withMessage("Логин не должен быть пустым")
    .isString().withMessage("Логин должен быть строкой")
    .isLength({ max: 50 }).withMessage("Длина логина не должна превышать 50 символов"),
  body("password")
    .notEmpty().withMessage("Пароль не должен быть пустым")
    .isString().withMessage("Пароль должен быть строкой")
];
// Страница регистрации
app.get("/signup", function(_, response){
    response.sendFile(__dirname + "/pages/signup.html");
});
// Маршрут для логики регистрации
app.post("/api/signup", jsonParser, signupValidationRules, CompanyController.create);

// 3. Маршрут выхода
app.post("/api/logout", CompanyController.logout);

// 4. Маршруты для кораблей
// Маршрут получения данных о корабле по ID
app.get("/api/ship/:id", [
  param('id').isInt().withMessage("ID должен быть числом"),
], ShipController.get);
// Маршрут создания корабля
app.post("/api/ship", jsonParser, [
  body("name")
    .notEmpty().withMessage("name обязательно")
    .isString().withMessage("name должно быть строкой")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов")
], ShipController.create);
// Маршрут изменения данных корабля
app.post("/api/ship/:id", jsonParser, [
  param("id").isInt().withMessage("ID должен быть числом"),
  body("name")
    .optional()
    .isString().withMessage("name должно быть строкой")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  // body("created_at")
  //   .optional()
  //   .isISO8601().withMessage("created_at должно быть датой"),
  // body("updated_at")
  //   .optional()
  //   .isISO8601().withMessage("updated_at должно быть датой")  
], ShipController.update);
app.delete("/api/ship/:id", [
  param("id").isInt().withMessage("ID должен быть числом"),
], ShipController.delete);

// 5. Маршруты для собственности
// Маршрут для получения собственности по ID
app.get("/api/property/:id", [
  param("id").isInt().withMessage("ID должен быть числом")
], PropertyController.get);
// Маршрут для создания собственности
app.post("/api/property", jsonParser, [
  body("name")
    .isString().withMessage("name должно быть строкой")
    .notEmpty().withMessage("name обязательно")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("type_id")
    .isInt().withMessage("type_id должно быть числом"),
  body("ship_id")
    .isInt().withMessage("ship_id Должен быть числом"),
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
// Маршрут для изменения собственности по ID
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
  body("ship_id")
    .optional()
    .isInt().withMessage("ship_id должен быть числом"),
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
// Маршрут для удаления собственности по ID
app.delete("/api/property/:id", [
  param("id").isInt().withMessage("ID должен быть числом"),
], PropertyController.delete);

// 6. Маршруты для типов собственности
// Маршрут получения типа по ID
app.get("/api/propertyType/:id", [
  param('id').isInt().withMessage("ID должен быть числом"),
], PropertyTypeController.get);
// Маршрут создания типа
app.post("/api/propertyType", jsonParser, [
  body("name")
    .notEmpty().withMessage("name обязательно")
    .isString().withMessage("name должно быть строкой")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("parent_id")
    .optional()
    .isInt().withMessage("parent_id должен быть числом")
], PropertyTypeController.create);
// Маршрут обновления данных типа по ID
app.post("/api/propertyType/:id", jsonParser, [
  param("id").isInt().withMessage("ID должен быть числом"),
  body("name")
    .optional()
    .isString().withMessage("name должно быть строкой")
    .isLength({ max: 50 }).withMessage("name должно быть не более 50 символов"),
  body("parent_id")
    .optional({ nullable: true })
    .isInt().withMessage("parent_id должен быть числом"),
  // body("created_at")
  //   .optional()
  //   .isISO8601().withMessage("created_at должно быть датой"),
  // body("updated_at")
  //   .optional()
  //   .isISO8601().withMessage("updated_at должно быть датой")  
], PropertyTypeController.update);
// Маршрут удаления типа
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
