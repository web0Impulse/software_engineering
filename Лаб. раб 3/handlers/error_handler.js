export const DB_ERR_CODES = {
  ER_DUP_ENTRY: 'ER_DUP_ENTRY',
  ER_NO_REFERENCED_ROW: 'ER_NO_REFERENCED_ROW',
  ER_ACCESS_DENIED_ERROR: 'ER_ACCESS_DENIED_ERROR',
  ECONNREFUSED: 'ECONNREFUSED',
  ER_PARSE_ERROR: 'ER_PARSE_ERROR'
};

const DB_ERR_MAP = {
  ER_DUP_ENTRY: {
      status: 409,
      message: 'Field already used'
  },
  ER_NO_REFERENCED_ROW: {
      status: 404,
      message: 'Referenced record not found'
  },
  ER_ACCESS_DENIED_ERROR: {
      status: 500,
      message: 'Database connection error'
  },
  ECONNREFUSED: {
      status: 503,
      message: 'Service unavailable'
  },
  ER_PARSE_ERROR: {
      status: 400,
      message: 'Invalid query'
  },
  NOT_RECOGINZED_ER: {
      status: 500,
      message: 'Ошибка на сервере. Попробуйте позже'
  }
}
export function databaseErrorHandler(error, response) {
    let errorConfig;
    if (DB_ERR_MAP[error.code]) {
      errorConfig = DB_ERR_MAP[error.code];
      if (error.message) errorConfig.message = error.message;
    } else {
      errorConfig = DB_ERR_MAP.NOT_RECOGINZED_ER;
      errorConfig.origin = error;
    }
    errorConfig.timestamp = new Date().toISOString();
    response.status(errorConfig.status).json(errorConfig);
}
