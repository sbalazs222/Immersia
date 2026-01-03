import { req, res } from 'express';

export function Login(req: Request, res: Response, next) {
  try {
    return res.status(200).json({
      message: 'Successful login.', data: {
        username: 'user',
      }
    });
  }
  catch (error) {
    next(error);
  }
}
export function Register(req, res, next) {
  try {
    const body = req.body;

    return res.status(200).json({
      message: 'Successful registration.', data:
        JSON.stringify(body),
    });
  }
  catch (error) {
    next(error);
  }
}
export function Verify(req, res, next) {

}
export function Refresh(req, res, next) {

}
export function Logout(req, res, next) {

}
