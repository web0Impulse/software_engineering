// Commit notes
// 1) Базовая модель

// Импорт модулей
import { MySQL_CONNECTION } from "../sql_connection.js"; // подключения к бд
import MYSQL from "mysql2";
const { Types } = MYSQL;

// TODO добавить стандартный обработчик ошибок самописных функций
// /**
//  * Функция проверки имени таблицы БД
//  * @param {string} table Имя таблицы
//  */
// function validateTable(table) {
//   if (!table || typeof(table) != "string") {
//     throw new Error("Param 'table' must be a string");
//   }
// }
// /**
//  * Функция проверки массива видимых полей
//  * @param {Array<string>} visible Массив видимых полей
//  */
// function validateVisible(visible) {
//   if (!Array.isArray(visible)) {
//     throw new Error("Param 'visible' must be an array of str");
//   }
//   visible.forEach((item, i) => {
//     if (typeof(item) != "string") {
//       throw new Error("Param 'visible' must be an array of str");
//     }
//   });
// }
// /**
//  * Функция проверки массива всех полей
//  * @param {Array<string>} visible Массив всех полей
//  */
// function validateFields(fields) {
//   if (!Array.isArray(fields)) {
//     throw new Error("Param 'fields' must be an array of str");
//   }
//   fields.forEach((item, i) => {
//     if (typeof(item) != "string") {
//       throw new Error("Param 'fields' must be an array of str");
//     }
//   });
// }


// /**
//  * Функция проверки orderBy
//  * @param {string} orderByColumn Название колонки по которой будет вестись сортировка
//  * @param {string} orderByType Название типа сортировки: ASC, DESC, DEFAULT
//  * @param {Array<string>} fields Поля модели
//  */
// function validateOrderBy(orderByColumn, orderByType, fields) {
//   if (!orderByColumn || typeof(orderByColumn) != "string") {
//     throw new Error("Param 'orderByColumn' must be a string");
//   }
//   if (typeof(orderByType) != "string" 
//       || (!["", "asc", "desc"].includes(orderByType.toLowerCase()))
//     ) {
//     throw new Error("Param 'orderByType' must be a str included in 'ASC', 'DESC', ''");
//   }
//   if (!Array.isArray(fields)) {
//     throw new Error("Param 'fields' must be an array of str");
//   }
//   fields.forEach((item, i) => {
//     if (typeof(item) != "string") {
//       throw new Error("Param 'fields' must be an array of str");
//     }
//   });
//   if (fields.length == 0) {
//     throw new Error("Param 'fields' must include at least 1 element");
//   }
//   if (orderByColumn != "id" && !fields.includes(orderByColumn)) {
//     throw new Error("Param 'orderByColumn' must be included to 'fields'");
//   } 
// }

// /**
//  * todo рассмотрет целесообразность функции и доделат или вырезать
//  * Функция выбора записи по ключу
//  * @param {ModelType} modelObj Текущий объект модели
//  * @param {string} [orderByColumn="id"] Колонка по которой необходимо вести сортировку
//  * В случае если она не указана сортировка будет вестись по колонке id
//  * Если колонка id отсутствует будет вестись сортировка по первой колонке
//  * @param {string} [orderByType=""] Тип сортировки
//  * Доступные типы сортировки '', ASC, DESC
//  * @param {number} [limitStartPos=0] Начало выборки
//  * @param {number} [limitEndPos=0] Конец выборки
//  * 
//  * @param {string} table Название таблицы
//  * В противном случае будут показаны все поля
//  * @param {string|number} value значение соответствующей записи
//  * @param {Array<string>} visible Поля таблицы, которые будут отображены в запросе
//  * @param {string} keyName название ключа по которому будет вестись поиск
//  * @returns {Promise<object>} возвращающий искомый объект
//  *  */ 
// function getByWhereCondition(table, keyName, value, visible = []) {
//   // Проверка параметров
//   // TODO добавить стандартный обработчик ошибок самописных функций
//   if (!table || typeof(table) != "string") {
//     throw new Error("Param 'table' must be a string");
//   }
//   if (!Array.isArray(visible)) {
//     throw new Error("Param 'visible' must be an array of str");
//   }
//   visible.forEach((item, i) => {
//     if (typeof(item) != "string") {
//       throw new Error("Param 'visible' must be an array of str");
//     }
//   });
//   if (!keyName && typeof(keyName) != "string") {
//     throw new Error("Param 'keyName' must be a string");
//   }
//   if (!value && (typeof(value) != "string" || typeof(value) != "number")) {
//     throw new Error("Param 'value' must be a number or string");
//   }

//   // Шаблон sql
//   let sql = `SELECT * FROM ${table} WHERE ${keyName} = ?`;
//   // Добавление полей в строку
//   if (visible.length > 0) {
//     const select_sql_str = visible.join(", ");
//     sql = sql.replace("*", select_sql_str);
//   }

//   return MySQL_CONNECTION
//       .promise()
//       .query(sql, [value])
//       .then(([result]) => { return result[0] || {} });
// }



// function update(table, fillable, data) {
  
// }

/**
 * Функция выбора всех записей из таблицы
 * Если у модели массив visible указан как [] будут выведены все поля таблицы
 * @param {ModelType} modelObj Текущий объект модели
 * @param {string} [extendSQLStr = ""] Дополняющая SQL строка
 * @param {Array<string>} [extendSQLValues = []] Значения для extendSQLStr
 * @returns {Promise<Array<object>>} Возврат массива объектов
 *  */ 
function getAll (modelObj, extendSQLStr = "", extendSQLValues = []) {
  // Шаблон sql
  let sql = `SELECT * FROM ${modelObj.table} ${extendSQLStr}`;
  // Добавление полей в строку
  if (modelObj.visible.length > 0) { 
    const select_sql_str = modelObj.visible.join(", ");
    sql = sql.replace("*", select_sql_str);
  } else {
    sql = sql.replace("*", "'VISIBLE NOT SET'");
  }
  
  // Возврат promise запроса, который после 
  return MySQL_CONNECTION
      .promise()
      .query(sql, extendSQLValues)
      .then(([result]) => {
        modelObj.values = result;
        return result 
      });
}

/**
 * Функция создания записи
 * @param {ModelType} modelObj Текущий объект модели
 * @param {object} data Данные для записи
 * @param {string} [extendSQLStr = ""] Дополняющая SQL строка
 * @param {Array<string>} [extendSQLValues = []] Значения для extendSQLStr
 * @returns {Promise<Array<object>>} Возврат массива в котором находиться один объект - созданная запись
 *  */
function create(
    modelObj,
    data,
    extendSQLStr = "",
    extendSQLValues = []
  ) {
  
    //Шаблонная строка
  let sql = `INSERT INTO ${modelObj.table}({{fillable}}) VALUES ({{values}})`;
  const dataKeysList = Object.keys(data);
  let fillableSql = "";
  let valuesSql = "";
  let fillableDataKeys = [];
  const fillableDataValues = [];

  if (modelObj.fillable.length > 0) {
    dataKeysList.forEach((key, i) => {
      if (modelObj.fillable.includes(key)) {
        fillableDataKeys.push(key);
        fillableDataValues.push(data[key]);
      }
    });
  } else {
    fillableDataKeys = modelObj.fields;
    fillableDataKeys.forEach((key, i) => {
      fillableDataValues.push(data[key]);
    });
  }
  
  fillableSql = fillableDataKeys.join(", ");
  valuesSql = Array(fillableDataKeys.length).fill("?").join(", ");
  
  if (modelObj.timestamp) {
    if (!fillableDataKeys.includes("updated_at")) {
      fillableSql += ", updated_at";
      valuesSql += ", ?";
      const now = new Date();
      fillableDataValues.push(now.toISOString().slice(0, 19).replace('T', ' '));
    }
    if (!data["updated_at"]){
      const now = new Date();
      fillableDataValues.push(now.toISOString().slice(0, 19).replace('T', ' '));
    }
    if (!fillableDataKeys.includes("created_at")) {
      fillableSql += ", created_at";
      valuesSql += ", ?";
      const now = new Date();
      fillableDataValues.push(now.toISOString().slice(0, 19).replace('T', ' '));
    }
    if (!data["created_at"]) {
      const now = new Date();
      fillableDataValues.push(now.toISOString().slice(0, 19).replace('T', ' '));
    }
  }

  sql = sql.replace("{{fillable}}", fillableSql);
  sql = sql.replace("{{values}}", valuesSql);
  
  return MySQL_CONNECTION
      .promise()
      .query(sql, fillableDataValues)
      .then(([result]) => { {
        const insertId = result.insertId;
        return getAll(modelObj, `WHERE id = ${insertId}`)
          .then(result => {
            return result;
          });
      }});
}

/**
 * Функция обновления всех записей содержащихся в values
 * @param {ModelType} modelObj Текущий объект модели
 * @param {object} data Данные для записи
 * @param {string} [extendSQLStr = ""] Дополняющая SQL строка
 * @param {Array<string>} [extendSQLValues = []] Значения для extendSQLStr
 * @returns {Promise<Array<object>>} Возврат массива обновленных объектов
 *  */
function update(
    modelObj,
    data,
    extendSQLStr = "",
    extendSQLValues = []
  ) {
  function generateWhere(modelValue) {
    let sql = "WHERE ";
    Object.keys(modelValue).forEach((item) => {
      sql += `${item} = '${modelValue[item]}' AND `;
    });
    return sql.slice(0, sql.length - 4);
  }
    //Шаблонная строка
  let sql = `UPDATE ${modelObj.table} SET `;
  const dataKeysList = Object.keys(data);
  let fillableSql = "";
  let valuesSql = "";
  let fillableDataKeys = [];
  const fillableDataValues = [];

  if (modelObj.fillable.length > 0) {
    dataKeysList.forEach((key, i) => {
      if (modelObj.fillable.includes(key)) {
        fillableDataKeys.push(key);
        fillableDataValues.push(data[key]);
      }
    });
  } else {
    fillableDataKeys = modelObj.fields;
    fillableDataKeys.forEach((key, i) => {
      fillableDataValues.push(data[key]);
    });
  }

  fillableSql = fillableDataKeys.join(" = ?,") + " = ? ";

  sql += fillableSql;

  let updatePromises = modelObj.values.map((item, i) => {
    return MySQL_CONNECTION
      .promise()
      .query(`${sql} ${generateWhere(item)}`, fillableDataValues)
      .then(([result]) => {
        return true;
      })
  });

  return Promise.all(updatePromises)
    .then(() => {
      return true;
    })
}

/**
 * Функция удаления всех записей содержащихся в values
 * @param {ModelType} modelObj Текущий объект модели
 * @returns {Promise<boolean>} Возврат флага удаления
 */
function deleteValues(modelObj) {
  function generateWhere(modelValue) {
    let sql = "WHERE ";
    Object.keys(modelValue).forEach((item) => {
      sql += `${item} = '${modelValue[item]}' AND `;
    });
    return sql.slice(0, sql.length - 4);
  }
  let deletePromises = modelObj.values.map((item, i) => {
    return MySQL_CONNECTION
      .promise()
      .query(`DELETE FROM ${modelObj.table} ${generateWhere(item)}`)
      .then(() => {
        return true;
      })
  });
  return Promise.all(deletePromises)
    .then(() => {
      modelObj.values = [];
      return true;
    })
}

/**
 * @typedef {Object} ModelType
 * @property {string} table - Название таблицы
 * @property {Array<string>} fields - Массив полей таблицы
 * @property {Array<string>} aliases - Алиасы для полей
 * @property {Array<string>} locAliases - Локальные алиасы
 * @property {Array<string>} fillable - Заполняемые поля
 * @property {Array<string>} visible - Поля, которые видимы
 * @property {boolean} timestamp - Указание на то нужно ли автоматически проставлять временные метки
 * @property {Array<string>} values - Полученная запись/записи
 * @property {function([string], [Array<string>]): Promise<Array<object>>} getAll - Получить все записи
 * @property {function(object): Promise<Array<object>>} create - Создать запись
 * @property {function(object): Promise<Array<object>>} update - Обновить записи содеражиеся в values
 * @property {function(): Promise<boolean>} deleteValues - Удаление всех записей содержащихся в values
 */
export const MODEL = {
  table: "",
  fields: [],
  aliases: [],
  locAliases: [],
  fillable: [],
  visible: [],
  values: [],
  timestamp: true,
  getAll (extendSQLStr = "", extendSQLValues = []) {
    return getAll(this, extendSQLStr, extendSQLValues);
  },
  create(data) {
    return create(this, data);
  },
  update(data) {
    return update(this, data);
  },
  deleteValues() {
    return deleteValues(this);
  }
}

// НЕВОШЕДШЕЕ
// /**
//  * Функция выбора всех записей из таблицы
//  * Если у модели массив visible указан как [] будут выведены все поля таблицы
//  * @param {ModelType} modelObj Текущий объект модели
//  * @param {string} [orderByColumn="id"] Колонка по которой необходимо вести сортировку
//  * В случае если она не указана сортировка будет вестись по колонке id
//  * Если колонка id отсутствует будет вестись сортировка по первой колонке
//  * @param {string} [orderByType=""] Тип сортировки
//  * Доступные типы сортировки '', ASC, DESC
//  * @param {number} [limitStartPos=0] Начало выборки
//  * @param {number} [limitEndPos=0] Конец выборки
//  * @returns {Promise<Array<object>>} возвращающий массив всех записей
//  *  */ 
// function getAll (
//     modelObj,
//     orderByColumn = "id", 
//     orderByType = "", 
//     limitStartPos = 0, 
//     limitEndPos = 0
//   ) {
//   // Проверка параметров
//   validateTable(modelObj.table);
//   validateVisible(modelObj.visible);
  
//   validateOrderBy(orderByColumn, orderByType, modelObj.fields);
//   if (!Number.isInteger(limitStartPos) || limitStartPos < 0) {
//     throw new Error("Param 'limitStartPos' must be a positive integer");
//   }
//   if (!Number.isInteger(limitEndPos) || limitEndPos < 0 || (limitEndPos != 0 && limitEndPos <= limitStartPos)) {
//     throw new Error("Param 'limitEndPos' must be a positive integer bigger than 'limitStartPos'");
//   }

//   // Шаблон sql
//   let sql = `SELECT * FROM ${modelObj.table}`;
//   // Добавление полей в строку
//   if (modelObj.visible.length > 0) { 
//     const select_sql_str = modelObj.visible.join(", ");
//     sql = sql.replace("*", select_sql_str);
//   }

//   // Добавление OrderBy
//   if (orderByColumn == "id" && !modelObj.fields.includes(orderByColumn)) {
//     sql += ` ORDER BY ${modelObj.fields[0]} ${orderByType}`;
//   } else {
//     sql += ` ORDER BY ${orderByColumn} ${orderByType}`;
//   }

//   // Добавление Limit
//   if (Number.isInteger(limitEndPos) && limitEndPos > 0) {
//     sql += ` LIMIT ${limitStartPos}, ${limitEndPos}`;
//   }
//   console.log("SQL: ", sql);
  
//   // Возврат promise запроса
//   return MySQL_CONNECTION
//       .promise()
//       .query(sql)
//       .then(([result]) => { return result });
// }

// /**
//  * Функция создания записи
//  * @param {ModelType} modelObj Текущий объект модели
//  * @param {object} data данные для сохранения
//  * param {boolean} [timestamp=false]
//  * @returns {Promise<object>} возвращающий созданный объект
//  *  */
// function create(
//     modelObj,
//     data,
//     // timestamp = false
//   ) {
  // Проверка параметров
  // validateTable(modelObj.table);
  // if (!Array.isArray(fields)) {
  //   throw new Error("Param 'fields' must be an array of str");
  // }
  // fields.forEach((item, i) => {
  //   if (typeof(item) != "string") {
  //     throw new Error("Param 'fields' must be an array of str");
  //   }
  // });
  // validateFields(modelObj.fields);
  // if (!Array.isArray(fillable)) {
  //   throw new Error("Param 'fillable' must be an array of str");
  // }
  // fillable.forEach((item, i) => {
  //   if (typeof(item) != "string") {
  //     throw new Error("Param 'fillable' must be an array of str");
  //   }
  // });
  // if (typeof(data) != "object" || Object.keys(data).length == 0) {
  //   throw new Error("Param 'data' must be a not empty object");
  // }
  // if (!Array.isArray(visible)) {
  //   throw new Error("Param 'visible' must be an array of str");
  // }
  // visible.forEach((item, i) => {
  //   if (typeof(item) != "string") {
  //     throw new Error("Param 'visible' must be an array of str");
  //   }
  // });
  // TODO добавить проверку на одновложенность объекта data

  // let sql = `INSERT INTO ${table}({{fillable}}) VALUES ({{values}})`;
  // const dataKeysList = Object.keys(data);
  // let fillableSql = "";
  // let valuesSql = "";
  // let fillableDataKeys = [];
  // const fillableDataValues = [];

  // if (modelObj.fillable.length > 0) {
  //   dataKeysList.forEach((key, i) => {
  //     if (modelObj.fillable.includes(key)) {
  //       fillableDataKeys.push(key);
  //       fillableDataValues.push(data[key]);
  //     }
  //   });
  // } else {
  //   fillableDataKeys = modelObj.fields;
  //   fillableDataKeys.forEach((key, i) => {
  //     fillableDataValues.push(data[key]);
  //   });
  // }

  // if (timestamp
  //     && fields.includes("updated_at")
  //     && fillable.includes("updated_at")
  //     && !fillableDataKeys.includes("updated_at")
  //   ) {
  //   fillableDataKeys.push("updated_at");
  //   const now = new Date();
  //   fillableDataValues.push(now.toISOString().slice(0, 19).replace('T', ' '));
  // }
  // if (timestamp 
  //     && fields.includes("created_at")
  //     && fillable.includes("created_at")
  //     && !fillableDataKeys.includes("created_at")
  //   ) {
  //   fillableDataKeys.push("created_at");
  //   const now = new Date();
  //   fillableDataValues.push(now.toISOString().slice(0, 19).replace('T', ' '));
  // }
  
//   fillableSql = fillableDataKeys.join(", ");
//   valuesSql = Array(fillableDataKeys.length).fill("?").join(", ");
  
//   sql = sql.replace("{{fillable}}", fillableSql);
//   sql = sql.replace("{{values}}", valuesSql);
  
//   return MySQL_CONNECTION
//       .promise()
//       .query(sql, fillableDataValues)
//       .then(([result]) => { {
//         const insertId = result.insertId;
//         return getByKey(table, "id", insertId)
//           .then(result => {
//             const valuesArr = Array();
//             valuesArr.push(result);
//             values.values = valuesArr;
//             return result;
//           });
//       }});
// }