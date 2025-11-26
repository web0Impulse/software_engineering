// контроллер Имущества
// TODO: Добавить валидацию
import { Property } from "../models/property_model.js";
import { databaseErrorHandler } from "../handlers/error_handler.js";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../handlers/validation_errors_handler.js";

export class PropertyController {
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
      const propertyId = request.params["id"];
      const property = new Property();
      property.getAll("WHERE id = ?", [propertyId])
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
      const propertyData = request.body;
      // Внесение propertyType в БД
      // TODO: добавить проверку по type_id
      const property = new Property();
      // расчет dateNextInspection
      const datePrevInspectionParsed = new Date(propertyData.date_prev_inspection);
      const dateNextInspection = new Date(datePrevInspectionParsed.getTime() + propertyData.frequency_of_inspection);
      
      property.create({
          name: propertyData.name,
          type_id: propertyData.type_id,
          quantity: propertyData.quantity,
          location: propertyData.location || "",
          date_prev_inspection: propertyData.date_prev_inspection,
          frequency_of_inspection: propertyData.frequency_of_inspection,
          date_next_inspection: dateNextInspection,
          check_mark: propertyData.check_mark,
          is_ok: propertyData.is_ok,
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
      const updPropertyObj = {};
      if (requestData.name) {
          updPropertyObj.name = requestData.name;
      }
      if (requestData.type_id) {
          updPropertyObj.type_id = requestData.type_id;
      }
      if (requestData.quantity) {
          updPropertyObj.quantity = requestData.quantity;
      }
      if (requestData.location) {
          updPropertyObj.location = requestData.location;
      }
      if (requestData.date_prev_inspection) {
          updPropertyObj.date_prev_inspection = requestData.date_prev_inspection;
      }
      if (requestData.frequency_of_inspection) {
          updPropertyObj.frequency_of_inspection = requestData.frequency_of_inspection;
      }
      if (requestData.check_mark) {
          updPropertyObj.check_mark = requestData.check_mark;
      }
      if (requestData.is_ok) {
          updPropertyObj.is_ok = requestData.is_ok;
      }
      // Запись изменений в БД
      // TODO: добавить проверку по type_id
      const property = new Property();
      if (property.timestamp) {
        const now = new Date();
        updPropertyObj.updated_at = now.toISOString().slice(0, 19).replace('T', ' ');
      }

      property.getAll("WHERE id = ?", request.params["id"])
          .then(() => {
              if (!property.values.length) {
                  throw {
                      code: DB_ERR_CODES.ER_NO_REFERENCED_ROW,
                      message: "Типа имущества с таким ID не найдено",
                  }
              }
              // Перерасчет date_next_inspection
              if (requestData.date_prev_inspection) {
                  const datePrevInspectionParsed = new Date(requestData.date_prev_inspection);
                  let dateNextInspection = new Date();
                  if (requestData.frequency_of_inspection) {
                    dateNextInspection = new Date(datePrevInspectionParsed.getTime() + requestData.frequency_of_inspection);
                  } else {
                    dateNextInspection = new Date(datePrevInspectionParsed.getTime() + property.values[0].frequency_of_inspection);
                  }
                  updPropertyObj.date_next_inspection = dateNextInspection;
              }
              property.update(updPropertyObj)
                  .then(() => {
                      property.getAll("WHERE id = ?", request.params["id"])
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
      const property = new Property();
      property.getAll("WHERE id = ?", request.params["id"])
          .then(() => {
              if (!property.values.length) {
                  throw {
                      code: DB_ERR_CODES.ER_NO_REFERENCED_ROW,
                      message: "Типа имущества с таким ID не найдено",
                  }
              }
              property.deleteValues()
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