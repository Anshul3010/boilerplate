import { NextFunction } from "express";
import CustomError from "./error";

class BaseService {
    next: NextFunction
    customError: any = new CustomError()
    constructor(next: NextFunction) {
        this.next = next;
    }



    async RequestHandler(calledFunction: any, ...args: any) {
        try {
            console.log('hahhaha', ...args);

            console.log(this.customError.unAuthorized(), 'inside request handler');
            console.log(this)
            let result = await calledFunction(...args)
            console.log( result, 'result 1')
            return result;
        } catch(err) {
            this.next(err);
        }
    }
}

export {BaseService}
