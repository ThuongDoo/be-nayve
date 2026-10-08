import { config } from '../config/index.js';

export const notFound = (req, res) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    // A machine-readable reason, for errors the app reacts to (e.g. payment.service.js).
    ...(err.status && err.code && { code: err.code }),
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};
