const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter: 100 requests per minute per IP.
 */
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many requests from this IP, please try again after 1 minute.'
    }
});

/**
 * Auth-specific rate limiter: 5 attempts per 15 minutes per IP.
 * Applies to login and register routes to prevent brute force attacks.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
    }
});

module.exports = { apiLimiter, authLimiter };
