class GeneralErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
    }
}

const notFoundError = async (req, res, string = "not found") => {
    new GeneralErrorHandler(string, 404)
}

const somethingWrongError = async (req, res, string = "something wrong") => {
    new GeneralErrorHandler(string, 500)
}

const allFineError = async (req,res,string = "all fine ok") => {
    new GeneralErrorHandler(string, 200)
}

module.exports = {notFoundError, somethingWrongError, allFineError, GeneralErrorHandler}