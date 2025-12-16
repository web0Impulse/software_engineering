// контроллер Имущества
// TODO: Добавить валидацию
import { PropertyType } from "../models/property_type_model.js";
import { databaseErrorHandler, DB_ERR_CODES } from "../handlers/error_handler.js";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../handlers/validation_errors_handler.js";

export class PropertyTypeController {
  static async get(request, response) {
    // Проверка ошибок валидации
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return validationErrorHandler({
            status: 400,
            message: "Ошибка в запросе",
            errors: errors.array(),
        }, response);
    }
    const propertyTypeId = request.params["id"];
    const propertyType = new PropertyType();
    propertyType.getAll("WHERE id = ? AND company_id = ?", [propertyTypeId, request.session.user.id])
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

  static async create(request, response) {
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
    const propertyTypeData = request.body;
    // проверка по parent_id
    const propertyType = new PropertyType();
    if (propertyTypeData.parent_id) {
        propertyType.getAll("WHERE id = ? AND company_id = ?", [propertyTypeData.parent_id, request.session.user.id])
            .then((result) => {
                if (!propertyType.values.length) {
                    throw {
                        code: DB_ERR_CODES.ER_NO_REFERENCED_ROW,
                        message: "Property type с таким ID не найдено",
                    }
                }
            })
            .catch(err => {
                databaseErrorHandler(err, response);
            })
    } else {
        propertyTypeData.parent_id = null;
    }
    
    // Внесение propertyType в БД
    propertyType.create({
        name: propertyTypeData.name,
        parent_id: propertyTypeData.parent_id,
        company_id: request.session.user.id
    }).then((result) => {
        response.status(201).json({
            status: 201,
            data: result,
        })
    }).catch(err => {
        databaseErrorHandler(err, response);
    });
  }

  static async update(request, response) {
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

    // Проверка по parent_id
    const propertyType = new PropertyType();
    if (requestData.parent_id) {
        propertyType.getAll("WHERE id = ? AND company_id = ?", [requestData.parent_id, request.session.user.id])
            .then((result) => {
                if (!propertyType.values.length) {
                    throw {
                        code: DB_ERR_CODES.ER_NO_REFERENCED_ROW,
                        message: "Property type с таким ID не найдено",
                    }
                }
            })
            .catch(err => {
                databaseErrorHandler(err, response);
            })
    }

    // Сбор данных
    const updPropTypeObj = {};
    console.log(requestData);
    if (requestData.name) {
        updPropTypeObj.name = requestData.name;
    }
    if (requestData.parent_id || requestData.parent_id === null) {
        updPropTypeObj.parent_id = requestData.parent_id;
    }
    console.log(updPropTypeObj);
    // if (requestData.created_at) {
    //     updPropTypeObj.created_at = requestData.created_at;
    // }
    // if (requestData.updated_at) {
    //     updPropTypeObj.updated_at = requestData.updated_at;
    // }
    // Запись изменений в БД
    propertyType.getAll(
        "WHERE id = ? AND company_id = ?", 
        [
            request.params["id"],
            request.session.user.id
        ])
        .then(() => {
            if (!propertyType.values.length) {
                throw {
                    code: DB_ERR_CODES.ER_NO_REFERENCED_ROW,
                    message: "Типа имущества с таким ID не найдено",
                }
            }
            if (!updPropTypeObj.parent_id && updPropTypeObj.parent_id !== null) {
                updPropTypeObj.parent_id = propertyType.values[0].parent_id;
            }
            propertyType.update(updPropTypeObj)
                .then(() => {
                    propertyType.getAll("WHERE id = ? AND company_id = ?", [request.params["id"], request.session.user.id])
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
    const propertyType = new PropertyType();
    propertyType.getAll("WHERE id = ?", request.params["id"])
        .then(() => {
            if (!propertyType.values.length) {
                throw {
                    code: DB_ERR_CODES.ER_NO_REFERENCED_ROW,
                    message: "Типа имущества с таким ID не найдено",
                }
            }
            propertyType.deleteValues()
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