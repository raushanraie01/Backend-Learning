const asyncHandler = (requestHanlder) => {
  (req, res, next) => {
    Promise.resolve(requestHanlder(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
