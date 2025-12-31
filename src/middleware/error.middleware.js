export function notFound(req, res, next) {
  const error = new Error(`未找到 - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    path: req.path,
    timestamp: new Date().toISOString()
  });
}
