import { ConsoleColor as cc } from 'psgutil';

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

  res.status(statusCode).json({
    message: message,
  });
};

export default ErrorHandler;
