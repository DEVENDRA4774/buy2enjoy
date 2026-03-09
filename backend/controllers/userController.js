const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { issueTokens, revokeRefreshTokens, revokeRefreshToken, generateAccessToken } = require('../utils/generateToken');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const accessToken = await issueTokens(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            accessToken
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const isAdmin = process.env.ADMIN_EMAIL && req.body.email === process.env.ADMIN_EMAIL;

    const user = await User.create({
        name,
        email,
        password,
        isAdmin
    });

    if (user) {
        const accessToken = await issueTokens(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            accessToken
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Refresh access token using refresh token cookie
// @route   POST /api/users/refresh
// @access  Public (but requires valid refresh token cookie)
const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        res.status(401);
        throw new Error('No refresh token provided');
    }

    // Find the refresh token in DB
    const storedToken = await RefreshToken.findOne({ token });

    if (!storedToken) {
        res.status(401);
        throw new Error('Invalid refresh token — please log in again');
    }

    // Check if expired (MongoDB TTL might not have cleaned it yet)
    if (storedToken.expiresAt < new Date()) {
        await revokeRefreshToken(token);
        res.status(401);
        throw new Error('Refresh token expired — please log in again');
    }

    // Token rotation: delete old refresh token, issue a new pair
    await revokeRefreshToken(token);
    const accessToken = await issueTokens(res, storedToken.userId);

    res.json({ accessToken });
});

// @desc    Logout user / clear cookies & revoke tokens
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    // Revoke the specific refresh token from cookie
    const token = req.cookies.refreshToken;
    if (token) {
        await revokeRefreshToken(token);
    }

    // Clear cookies
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });

    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            pin_code: user.pin_code,
            city: user.city,
            wallet_balance: user.wallet_balance,
            loyalty_points: user.loyalty_points,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.pin_code = req.body.pin_code || user.pin_code;
        user.city = req.body.city || user.city;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            pin_code: updatedUser.pin_code,
            city: updatedUser.city,
            wallet_balance: updatedUser.wallet_balance,
            loyalty_points: updatedUser.loyalty_points,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user's own data export (DPDP compliance)
// @route   GET /api/users/data-export
// @access  Private
const exportUserData = asyncHandler(async (req, res) => {
    const User = require('../models/User');
    const Order = require('../models/Order');
    const Booking = require('../models/Booking');
    const WalletTransaction = require('../models/WalletTransaction');
    const HealthRecord = require('../models/HealthRecord');
    const Notification = require('../models/Notification');
    const Review = require('../models/Review');

    const userId = req.user._id;

    const [user, orders, bookings, transactions, healthRecords, notifications, reviews] = await Promise.all([
        User.findById(userId).select('-password'),
        Order.find({ user: userId }),
        Booking.find({ user_id: userId }),
        WalletTransaction.find({ user_id: userId }),
        HealthRecord.find({ user_id: userId }),
        Notification.find({ user_id: userId }),
        Review.find({ user_id: userId })
    ]);

    res.json({
        exportDate: new Date().toISOString(),
        user,
        orders,
        bookings,
        walletTransactions: transactions,
        healthRecords,
        notifications,
        reviews
    });
});

// @desc    Delete user account and all data (DPDP right to erasure)
// @route   DELETE /api/users/account
// @access  Private
const deleteUserAccount = asyncHandler(async (req, res) => {
    const Order = require('../models/Order');
    const Booking = require('../models/Booking');
    const WalletTransaction = require('../models/WalletTransaction');
    const HealthRecord = require('../models/HealthRecord');
    const Notification = require('../models/Notification');
    const Review = require('../models/Review');

    const userId = req.user._id;

    // Delete all user data across all collections
    await Promise.all([
        Order.deleteMany({ user: userId }),
        Booking.deleteMany({ user_id: userId }),
        WalletTransaction.deleteMany({ user_id: userId }),
        HealthRecord.deleteMany({ user_id: userId }),
        Notification.deleteMany({ user_id: userId }),
        Review.deleteMany({ user_id: userId }),
        revokeRefreshTokens(userId),
        User.findByIdAndDelete(userId)
    ]);

    // Clear cookies
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });

    res.json({ message: 'Account and all associated data deleted successfully' });
});

module.exports = {
    authUser,
    registerUser,
    refreshAccessToken,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    exportUserData,
    deleteUserAccount
};
