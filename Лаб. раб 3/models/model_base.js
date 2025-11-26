// Импорт модулей
import { MySQL_CONNECTION } from "../sql_connection.js"; // подключения к бд


/**
 * Базовый класс модели, реализующий основные свойства и методы для работы с данными.
 * @class
 */
export class ModelBase {
  /**
   * Создает экземпляр модели с переданными настройками.
   * @param {Object} [config={}] - Конфигурация модели.
   * @param {string} [config.table=""] - Название таблицы.
   * @param {Array<string>} [config.fields=[]] - Массив полей таблицы.
   * @param {Array<string>} [config.aliases=[]] - Алиасы для полей.
   * @param {Array<string>} [config.locAliases=[]] - Локальные алиасы.
   * @param {Array<string>} [config.fillable=[]] - Заполняемые поля.
   * @param {Array<string>} [config.visible=[]] - Поля, которые видимы.
   * @param {Array<string>} [config.values=[]] - Полученная запись или записи.
   * @param {boolean} [config.timestamp=true] - Нужно ли автоматически проставлять временные метки.
   */
  constructor(config = {}) {
    this._table = config.table || "";
    this._fields = config.fields || [];
    this._aliases = config.aliases || [];
    this._locAliases = config.locAliases || [];
    this._fillable = config.fillable || [];
    this._visible = config.visible || [];
    this._values = config.values || [];
    this._timestamp = config.hasOwnProperty('timestamp') ? config.timestamp : true;
  }

  // Геттеры и сеттеры для свойств
  get table() {
    return this._table;
  }
  set table(value) {
    this._table = value;
  }

  get fields() {
    return this._fields;
  }
  set fields(value) {
    this._fields = value;
  }

  get aliases() {
    return this._aliases;
  }
  set aliases(value) {
    this._aliases = value;
  }

  get locAliases() {
    return this._locAliases;
  }
  set locAliases(value) {
    this._locAliases = value;
  }

  get fillable() {
    return this._fillable;
  }
  set fillable(value) {
    this._fillable = value;
  }

  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
  }

  get values() {
    return this._values;
  }
  set values(value) {
    this._values = value;
  }

  get timestamp() {
    return this._timestamp;
  }
  set timestamp(value) {
    this._timestamp = value;
  }

  #generateWhere(modelValue) {
    let sql = "WHERE ";
    Object.keys(modelValue).forEach((item) => {
      if (modelValue[item] == null) {
        sql += `${item} is NULL AND `;
      } else {
        sql += `${item} = '${modelValue[item]}' AND `;
      }
    });
    return sql.slice(0, sql.length - 4);
  }

  /**
   * Получить все записи.
   * @param {string} [extendSQLStr=""] - Дополнительная SQL строка.
   * @param {Array<string>} [extendSQLValues=[]] - Значения для SQL.
   * @returns {Promise<Array<object>>}
   */
  getAll(extendSQLStr = "", extendSQLValues = []) {
    // Шаблон sql
    let sql = `SELECT * FROM ${this.table} ${extendSQLStr}`;
    // Добавление полей в строку
    if (this.visible.length > 0) { 
      const select_sql_str = this.visible.join(", ");
      sql = sql.replace("*", select_sql_str);
    } else {
      sql = sql.replace("*", "'VISIBLE NOT SET'");
    }
    
    // Возврат promise запроса, который после 
    return MySQL_CONNECTION
        .promise()
        .query(sql, extendSQLValues)
        .then(([result]) => {
          this.values = result;
          return result 
        });
  }

  /**
   * Создать новую запись.
   * @param {object} data - Данные для создания.
   * @returns {Promise<Array<object>>}
   */
  create(data) {
    let sql = `INSERT INTO ${this.table}({{fillable}}) VALUES ({{values}})`;
    const dataKeysList = Object.keys(data);
    let fillableSql = "";
    let valuesSql = "";
    let fillableDataKeys = [];
    const fillableDataValues = [];

    if (this.fillable.length > 0) {
      dataKeysList.forEach((key, i) => {
        if (this.fillable.includes(key)) {
          fillableDataKeys.push(key);
          fillableDataValues.push(data[key]);
        }
      });
    } else {
      fillableDataKeys = this.fields;
      fillableDataKeys.forEach((key, i) => {
        fillableDataValues.push(data[key]);
      });
    }
    
    fillableSql = fillableDataKeys.join(", ");
    valuesSql = Array(fillableDataKeys.length).fill("?").join(", ");
    
    if (this.timestamp) {
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
          return this.getAll(`WHERE id = ${insertId}`)
            .then(result => {
              return result;
            });
        }});
  }

  /**
   * Обновить существующие записи находящиеся в поле values.
   * @param {object} data - Данные для обновления.
   * @returns {Promise<Array<object>>}
   */
  update(data) {
      //Шаблонная строка
    let sql = `UPDATE ${this.table} SET `;
    const dataKeysList = Object.keys(data);
    let fillableSql = "";
    let fillableDataKeys = [];
    const fillableDataValues = [];

    if (this.fillable.length > 0) {
      dataKeysList.forEach((key, i) => {
        if (this.fillable.includes(key)) {
          fillableDataKeys.push(key);
          fillableDataValues.push(data[key]);
        }
      });
    } else {
      fillableDataKeys = this.fields;
      fillableDataKeys.forEach((key, i) => {
        fillableDataValues.push(data[key]);
      });
    }

    fillableSql = fillableDataKeys.join(" = ?,") + " = ? ";

    sql += fillableSql;

    let updatePromises = this.values.map((item, i) => {
      return MySQL_CONNECTION
        .promise()
        .query(`${sql} ${this.#generateWhere(item)}`, fillableDataValues)
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
   * Удалить все значения находящиеся в поле values.
   * @returns {Promise<boolean>}
   */
  deleteValues() {
    let deletePromises = this.values.map((item, i) => {
    return MySQL_CONNECTION
      .promise()
      .query(`DELETE FROM ${this.table} ${this.#generateWhere(item)}`)
      .then(() => {
        return true;
      })
    });
    return Promise.all(deletePromises)
      .then(() => {
        this.values = [];
        return true;
      })
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