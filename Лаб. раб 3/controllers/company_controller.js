// контроллер Компании
// TODO: Добавить валидацию
import { Company } from "../models/company_model.js";
import { databaseErrorHandler } from "../handlers/error_handler.js";
import crypto from "crypto";

export class CompanyController {
  // Метод создания компании
  static async create (request, response) {
    // Считывание данных
    let companyData = request.body;
    // Создание хэша пароля
    let passwordHash = crypto.createHash("sha256")
      .update(companyData.password)
      .digest("hex");
    // Внесение нового пользователя в БД
    // TODO: вернуть токен или сессию
    const company = new Company();
    company.create({
        name: companyData.company_name,
        login: companyData.login,
        password_hash: passwordHash,
    }).then((result) => {
        response.status(201).json({
            status: 201,
            data: result,
        })
    }).catch(err => {
        databaseErrorHandler(err, response);
    });
  }

  // Метод входа
  static async login(request, response) {
    // Извлекаем данные
    const data = request.body;
    // Хэшируем пароль
    const passwordHash = crypto.createHash("sha256")
      .update(data.password)
      .digest("hex");
    // Ищем компанию
    // TODO: вернуть токен или сессию
    const company = new Company();
    company.getAll("WHERE login = ? AND password = ?", [data.login, passwordHash])
        .then((result) => {
            return response.status(200).json({
                status: 200,
                data: result[0]
            })
        })
        .catch(err => {
            databaseErrorHandler(err, response);
        });
  }
}
