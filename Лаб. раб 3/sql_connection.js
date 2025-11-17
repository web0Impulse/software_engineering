import { DB_CONFIG } from "./config.js"; // импорт конфигов
import MYSQL from "mysql2"; // подключение драйвера
// создание подключения
export const MySQL_CONNECTION = MYSQL.createConnection(DB_CONFIG);
