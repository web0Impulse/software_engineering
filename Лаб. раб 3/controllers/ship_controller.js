// контроллер Кораблей
// TODO: Добавить валидацию
import { Ship } from "../models/ship_model.js";
import { databaseErrorHandler, DB_ERR_CODES } from "../handlers/error_handler.js";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../handlers/validation_errors_handler.js";

export class ShipController {
    // Метод возврата по ид
    static async get (request, response) {
        // Проверка ошибок валидации
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return validationErrorHandler({
                status: 400,
                message: "Ошибка в запросе",
                errors: errors.array(),
            }, response);
        }
        const shipId = request.params["id"];
        const ship = new Ship();
        ship.getAll("WHERE id = ? AND company_id = ?", [shipId, request.session.user.id])
            .then((result) => {
                return response
                    .status(200)
                    .json({
                        status: 200,
                        data: result[0] || {}
                    });
            })
            .catch(err => {
                databaseErrorHandler(err, response);
            })
    }


  // Метод создания корабля
  static async create (request, response) {
    // Проверка ошибок валидации
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return validationErrorHandler({
                status: 400,
                message: "Ошибка в запросе",
                errors: errors.array(),
            }, response);
        }

    // Считывание данных
    const shipData = request.body;
    // Внесение нового корябля в БД
    const ship = new Ship();
    ship.create({
        name: shipData.name,
        company_id: request.session.user.id,
    }).then((result) => {
        response.status(201).json({
            status: 201,
            data: result,
        })
    }).catch(err => {
        databaseErrorHandler(err, response);
    });
  }

  // Метод обновления данных корабля
  static async update (request, response) {
    // Проверка ошибок валидации
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return validationErrorHandler({
                status: 400,
                message: "Ошибка в запросе",
                errors: errors.array(),
            }, response);
        }
    // Считывание данных
    const requestData = request.body;
    const updShipObj = {};
    if (requestData.name) {
        updShipObj.name = requestData.name;
    }
    // Внесение нового корябля в БД
    const ship = new Ship();
    ship.getAll("WHERE id = ? AND company_id = ?", [request.params["id"], request.session.user.id])
        .then(() => {
            if (!ship.values.length) {
                throw {
                    code: DB_ERR_CODES.ER_NO_REFERENCED_ROW,
                    message: "Корабля с таким ID не найдено",
                }
            }
            ship.update(updShipObj)
                .then(() => {
                    ship.getAll("WHERE id = ?", request.params["id"])
                        .then((result) => {
                            return response
                                .status(200)
                                .json({
                                    status:200,
                                    data: result[0]
                                })
                        })
                })
        })
        .catch((err) => {
            databaseErrorHandler(err, response);
        });
  }

  // Удалить корабль из БД
  static async delete(request, response) {
    // Проверка ошибок валидации
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return validationErrorHandler({
                status: 400,
                message: "Ошибка в запросе",
                errors: errors.array(),
            }, response);
        }
    const ship = new Ship();
    ship.getAll("WHERE id = ? AND company_id = ?", [request.params["id"], request.session.user.id])
        .then(() => {
            if (!ship.values.length) {
                throw {
                    code: DB_ERR_CODES.ER_NO_REFERENCED_ROW,
                    message: "Корабля с таким ID не найдено",
                }
            }
            ship.deleteValues()
                .then(() => {
                    return response
                        .status(204)
                        .json({
                            status: 204
                        })
                })
        })
        .catch(err => {
            databaseErrorHandler(err, response);
        });
  }
}
