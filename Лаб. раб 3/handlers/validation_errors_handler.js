export function validationErrorHandler(error, response) {
    const errorConfig = error;
    errorConfig.origin = error.errors;
    errorConfig.timestamp = new Date().toISOString();
    response.status(errorConfig.status).json(errorConfig);
}
