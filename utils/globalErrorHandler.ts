import { NextFunction } from "express";

const ValidationErrorHandler: any = (error: any) => {
    const errors = Object.values(error.errors).map((el: any) => el.message);
    const message = `Invalid Input Data :  ${errors.join('. ')}`;
    return new Error(message);
  };


const Errdev: any = function(err: any,res: any){
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });

};

const ErrProd = (err: any, res: any) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.log('ERROR:  ', err);
      res.status(500).json({
        status: 'error',
        message: 'something went wrong!!!'
      });
    }
  }; 


const globalErrorHandler: any = (err: any, req: any, res: any, next: any) => {
  console.log('----------------------------globalerrorhandler---------------------');
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // console.log(err.message);
    // console.log(err);
    if(process.env.NODE_ENV === 'development'){
        Errdev(err,res);
    }else if(process.env.NODE_ENV === 'production'){
        if (err.name === 'ValidationError') err = ValidationErrorHandler(err);
        ErrProd(err, res);
    }
};

const requestHandler = async (calledFunction: any, res: any, next: NextFunction, ...args: any) => {
  try {
      let result = await calledFunction(...args)
      console.log( result, 'result 1')
      return result;
  } catch(err) {
    next(err);
  }
}

export  {globalErrorHandler, requestHandler}