const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/authMiddleware');
const WalletTransaction = require('../models/WalletTransaction');
const User = require('../models/User');

// @desc    Get wallet balance and recent transactions
// @route   GET /api/wallet
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('wallet_balance loyalty_points');
    const transactions = await WalletTransaction.find({ user_id: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);

    res.json({
        balance: user.wallet_balance,
        loyalty_points: user.loyalty_points,
        transactions
    });
}));

// @desc    Get full transaction history with pagination
// @route   GET /api/wallet/transactions?page=1&limit=20
// @access  Private
router.get('/transactions', protect, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
        WalletTransaction.find({ user_id: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        WalletTransaction.countDocuments({ user_id: req.user._id })
    ]);

    res.json({
        transactions,
        page,
        totalPages: Math.ceil(total / limit),
        total
    });
}));

// @desc    Add money to wallet (top-up)
// @route   POST /api/wallet/topup
// @access  Private
router.post('/topup', protect, asyncHandler(async (req, res) => {
    const { amount, payment_reference } = req.body;

    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error('Amount must be positive');
    }

    // Create transaction record
    const transaction = await WalletTransaction.create({
        user_id: req.user._id,
        amount,
        type: 'credit',
        category: 'topup',
        reference_id: payment_reference || '',
        description: `Wallet top-up of ₹${amount}`
    });

    // Update user balance
    await User.findByIdAndUpdate(req.user._id, {
        $inc: { wallet_balance: amount }
    });

    const user = await User.findById(req.user._id).select('wallet_balance');

    res.status(201).json({
        transaction,
        new_balance: user.wallet_balance
    });
}));

// @desc    Debit from wallet (for purchases)
// @route   POST /api/wallet/debit
// @access  Private
router.post('/debit', protect, asyncHandler(async (req, res) => {
    const { amount, category, reference_id, description } = req.body;

    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error('Amount must be positive');
    }

    const user = await User.findById(req.user._id);

    if (user.wallet_balance < amount) {
        res.status(400);
        throw new Error('Insufficient wallet balance');
    }

    const transaction = await WalletTransaction.create({
        user_id: req.user._id,
        amount,
        type: 'debit',
        category: category || 'shopping',
        reference_id: reference_id || '',
        description: description || `Wallet debit of ₹${amount}`
    });

    await User.findByIdAndUpdate(req.user._id, {
        $inc: { wallet_balance: -amount }
    });

    const updatedUser = await User.findById(req.user._id).select('wallet_balance');

    res.status(201).json({
        transaction,
        new_balance: updatedUser.wallet_balance
    });
}));

// @desc    Redeem loyalty points to wallet balance
// @route   POST /api/wallet/redeem-points
// @access  Private
router.post('/redeem-points', protect, asyncHandler(async (req, res) => {
    const { points } = req.body;
    const user = await User.findById(req.user._id);

    if (!points || points < 100) {
        res.status(400);
        throw new Error('Minimum 100 points required for redemption');
    }

    if (user.loyalty_points < points) {
        res.status(400);
        throw new Error('Insufficient loyalty points');
    }

    // 100 points = ₹10
    const creditAmount = Math.floor(points / 100) * 10;
    const actualPointsUsed = Math.floor(points / 100) * 100;

    const transaction = await WalletTransaction.create({
        user_id: req.user._id,
        amount: creditAmount,
        type: 'credit',
        category: 'loyalty_redemption',
        description: `Redeemed ${actualPointsUsed} points for ₹${creditAmount}`
    });

    await User.findByIdAndUpdate(req.user._id, {
        $inc: {
            wallet_balance: creditAmount,
            loyalty_points: -actualPointsUsed
        }
    });

    const updatedUser = await User.findById(req.user._id).select('wallet_balance loyalty_points');

    res.json({
        transaction,
        new_balance: updatedUser.wallet_balance,
        remaining_points: updatedUser.loyalty_points
    });
}));

module.exports = router;
