import { Router } from 'express';
import { Login, Logout, Refresh, Register } from '../controllers/authController.js';
import { AuthControllers } from '../controllers/index.js';
import { AuthenticateToken, ValidateRegisterSchema, ValidateRequiredFields } from '../middlewares/index.js';

const AuthRouter = Router();

AuthRouter.post('/login', ValidateRequiredFields(['email', 'password']), AuthControllers.Login);
AuthRouter.post('/register', ValidateRequiredFields(['email', 'password']), ValidateRegisterSchema, AuthControllers.Register);
AuthRouter.post('/refresh', AuthControllers.Refresh);
AuthRouter.post('/logout', AuthenticateToken, AuthControllers.Logout);

export default AuthRouter;
