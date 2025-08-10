function createError(status, message) {
    return {
        status,
        data: [],
        msg: message
    };
}

module.exports = { createError };