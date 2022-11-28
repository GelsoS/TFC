import { Router } from 'express';
import LoginController from '../controller/login.controller';

const router = Router();
const loginController = new LoginController();

router.post('/', loginController.login.bind(loginController));
router.get('/validate', loginController.validateLogin.bind(loginController));

export default router;
