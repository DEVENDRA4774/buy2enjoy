/**
 * Async handler wrapper to eliminate try-catch boilerplate in controllers.
 * Catches any rejected promise and forwards the error to Express error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
