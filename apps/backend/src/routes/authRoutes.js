import { Router } from 'express';
import { Login, Logout, Refresh, Register, Verify } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authentication.js';

const AuthRouter = Router();

AuthRouter.post('/login', Login);
AuthRouter.post('/register', Register);
AuthRouter.post('/refresh', authenticateToken, Refresh);
AuthRouter.post('/verify', authenticateToken, Verify);
AuthRouter.post('/logout', authenticateToken, Logout);

export default AuthRouter;
