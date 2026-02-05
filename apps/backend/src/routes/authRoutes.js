import { Router } from 'express';
import { Login, Logout, Refresh, Register, Verify } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validateRequiredFields } from 'psgutil';

const AuthRouter = Router();

AuthRouter.post('/login', validateRequiredFields(['email', 'password']), Login);
AuthRouter.post('/register', validateRequiredFields(['email', 'password']), Register);
AuthRouter.post('/refresh', Refresh);
AuthRouter.post('/verify', authenticateToken, Verify);
AuthRouter.post('/logout', authenticateToken, Logout);

export default AuthRouter;
