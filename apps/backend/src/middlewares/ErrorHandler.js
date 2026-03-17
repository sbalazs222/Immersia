import { ConsoleColor as cc } from 'psgutil';
import { env } from '../config/config.js';

const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (res.headersSent) {
    return next(err);
  }

  if (statusCode === 500) {
    console.error(`${cc.red}[ERROR] ${statusCode} - ${err.stack}`);
  } else {
    console.error(`${cc.red}[ERROR] ${statusCode} - ${err.message}`);
  }

  if (env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      message: message,
    });
  } else {
    res.status(statusCode).json({
      message: statusCode !== 500 ? message : 'INTERNAL_SERVER_ERROR',
    });
  }
};

export default ErrorHandler;
