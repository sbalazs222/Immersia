import { CreateRouter } from 'express';
import { Login, Logout, Refresh, Register, Verify } from '../controllers/authController.js';

const AuthRouter = CreateRouter();

AuthRouter.post('/login', Login);
AuthRouter.post('/register', Register);
AuthRouter.post('/refresh', Refresh);
AuthRouter.post('/verify', Verify);
AuthRouter.post('/logout', Logout);

export default AuthRouter;
