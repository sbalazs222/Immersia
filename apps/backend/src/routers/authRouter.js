import { Router } from 'express';
import { AuthControllers } from '../controllers/index.js';
import { AuthenticateToken, OptionalAuthenticateToken, ValidateRegisterSchema, ValidateRequiredFields } from '../middlewares/index.js';

const AuthRouter = Router();

AuthRouter.post('/login', ValidateRequiredFields(['email', 'password']), AuthControllers.Login);
AuthRouter.post('/register', ValidateRequiredFields(['email', 'password']), ValidateRegisterSchema, AuthControllers.Register);
AuthRouter.post('/logout', OptionalAuthenticateToken, AuthControllers.Logout);
AuthRouter.get("/me", AuthenticateToken, AuthControllers.Me)

export default AuthRouter;
