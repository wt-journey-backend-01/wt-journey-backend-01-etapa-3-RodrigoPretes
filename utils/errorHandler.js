function createError(status, message, error) {
    return {
        error: error ? error : true,
        message: message,
        status
    };
}

module.exports = { createError };