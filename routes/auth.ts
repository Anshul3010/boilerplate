import {NextFunction, Router} from 'express'
import Auth from '../controllers/auth';
import catchError from '../utils/errorHandlerdecorator';
import { requestHandler as RequestHandler, catchAsync} from '../utils/globalErrorHandler';

const router: any  = Router();

router.route('/login').post(catchAsync(async (req: any, res: any, next: NextFunction) => {
    let authService = new Auth();
    let result: any = await authService.login(req.body)
    res.status(result.code).json(result);
}))

router.route('/validate-otp').post(catchAsync(async (req: any, res: any, next: NextFunction) => {
    let authService = new Auth();
    let result: any = await authService.validateOTP(req.body.userId, req.body.otp)
    res.status(result.code).json(result);
}))

router.route('/register').post(catchAsync(async (req: any, res: any, next: NextFunction) => {
    let authService = new Auth();
    let result: any  = await authService.register(req.body)
    res.status(result.code).json(result);
}))

router.route('/forgot-password/:email').get(catchAsync(async (req: any, res: any, next: NextFunction) => {
    let authService = new Auth();
    let {email} = req.params;
    let result: any  = await authService.forgotPassword(email)
    res.status(result.code).json(result);
}))


router.route('/reset-password/:hashedData').post(catchAsync(async (req: any, res: any, next: NextFunction) => {
    let authService = new Auth();
    let {hashedData} = req.params;
    let data = {
        hashedData: hashedData,
        newPassword: req.body.password
    }
    let result: any  = await authService.changePassword(data)
    res.status(result.code).json(result);
}))

router.route('/resend-otp/:email').get(catchAsync(async (req: any, res: any, next: NextFunction) => {
    let authService = new Auth();
    let {email} = req.params;
    let result: any  = await authService.sendOTP('',email, '', true)
    res.status(result.code).json(result);
}))


export default router