import CustomError from "./error"

const ResponseBodyWrapper = (code: Number, message: String = "", data: Object = {}) => {
    let customErrorHandler = new CustomError()
    if(!code) {
        throw customErrorHandler.internalServerError()
    }

    return {
        code: code,
        status: "SUCCESS",
        message: message,
        data: data
    }
}


export  {ResponseBodyWrapper}