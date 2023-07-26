const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // Error Handler
  
  const errorHandler = (err, req, res, next) => {
    const statuscode = err.status || 500;
    res.status(statuscode);
    res.json({
      message: err?.message,
      stack: err?.stack,
    });
  };
  
  module.exports = { notFound, errorHandler };