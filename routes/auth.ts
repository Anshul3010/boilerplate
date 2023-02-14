import {NextFunction, Router} from 'express'
import Auth from '../controllers/auth';
import { requestHandler as RequestHandler } from '../utils/globalErrorHandler';

const router: any  = Router();

router.route('/login').post(async (req: any, res: any, next: NextFunction) => {
    let authService = new Auth(next);
    // console.log(authService.customError.unAuthorized())
    let result: any =await authService.login(req.body)
    // let result: any = await authService.login(req.body)
    console.log(result, 'result2');
    res.status(result.code).json(result);
})

export default router