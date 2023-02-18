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

export default router