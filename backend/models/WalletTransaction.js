const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true,
        index: true
    },
    category: {
        type: String,
        enum: ['topup', 'shopping', 'travel', 'health', 'bills', 'cashback', 'loyalty_redemption', 'refund'],
        required: true
    },
    reference_id: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    }
}, {
    timestamps: true
});

// Index for querying transaction history efficiently
walletTransactionSchema.index({ user_id: 1, createdAt: -1 });

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
module.exports = WalletTransaction;
