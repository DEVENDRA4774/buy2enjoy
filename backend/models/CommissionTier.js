const mongoose = require('mongoose');

const commissionTierSchema = new mongoose.Schema({
    sector: {
        type: String,
        enum: ['Shopping', 'Travel', 'Health', 'Wallet', 'Entertainment', 'MicroTourism'],
        required: true,
        unique: true
    },
    strategyType: {
        type: String,
        enum: ['Percentage', 'FlatFee', 'LeadGen', 'ConvenienceSurcharge'],
        required: true
    },
    // The exact cut taken by Buy2Enjoy
    platformTakeRate: {
        type: Number,
        required: true // e.g., 0.15 for 15% or 2.00 for $2 flat
    },
    // E.g., if true, $2 flat; if false, 15%
    isFlatAmount: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

const CommissionTier = mongoose.model('CommissionTier', commissionTierSchema);
module.exports = CommissionTier;
