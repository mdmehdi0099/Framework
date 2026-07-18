class APIException extends Error {

    constructor(message, statusCode = null, response = null) {
        super(message);

        this.name = "APIException";
        this.statusCode = statusCode;
        this.response = response;

        Error.captureStackTrace(this, this.constructor);
    }

}

module.exports = APIException;