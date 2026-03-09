const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');

const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

/**
 * Generate a short-lived access token (15 minutes).
 * This token is sent in the JSON response body — stored in memory on the frontend.
 */
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    });
};

/**
 * Generate a long-lived refresh token (7 days).
 * This is a random string stored in DB + set as httpOnly cookie.
 */
const generateRefreshToken = async (res, userId) => {
    // Create a cryptographically random token
    const token = crypto.randomBytes(40).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    // Store in DB
    await RefreshToken.create({
        userId,
        token,
        expiresAt
    });

    // Set as httpOnly cookie (JavaScript cannot read this — safe from XSS)
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    });

    return token;
};

/**
 * Issue both tokens during login/register.
 * Access token → JSON response body (stored in JS variable on frontend)
 * Refresh token → httpOnly cookie (safe from XSS)
 */
const issueTokens = async (res, userId) => {
    const accessToken = generateAccessToken(userId);
    await generateRefreshToken(res, userId);
    return accessToken;
};

/**
 * Revoke all refresh tokens for a user (used during logout).
 */
const revokeRefreshTokens = async (userId) => {
    await RefreshToken.deleteMany({ userId });
};

/**
 * Revoke a specific refresh token (used during token rotation).
 */
const revokeRefreshToken = async (token) => {
    await RefreshToken.deleteOne({ token });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    issueTokens,
    revokeRefreshTokens,
    revokeRefreshToken
};
