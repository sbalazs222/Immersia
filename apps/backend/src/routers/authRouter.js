import { Router } from 'express';
import { Login, Logout, Refresh, Register } from '../controllers/authController.js';
import { authenticateToken, validateRegisterSchema } from '../middlewares/index.js';
import { validateRequiredFields } from 'psgutil';

const AuthRouter = Router();

AuthRouter.post('/login', validateRequiredFields(['email', 'password']), Login);
AuthRouter.post('/register', validateRequiredFields(['email', 'password']), validateRegisterSchema, Register);
AuthRouter.post('/refresh', Refresh);
AuthRouter.post('/logout', authenticateToken, Logout);

export default AuthRouter;
