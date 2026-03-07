const mongoose = require('mongoose');

const subscriptionTierSchema = new mongoose.Schema({
    tierName: {
        type: String, // e.g., "Buy2Enjoy Plus"
        required: true,
        unique: true
    },
    monthlyFee: {
        type: Number, // e.g., 9.99
        required: true
    },
    benefits: {
        freeGroceryDelivery: { type: Boolean, default: false },
        zeroTravelFees: { type: Boolean, default: false },
        pointsMultiplier: { type: Number, default: 1.0 },
        prioritySupport: { type: Boolean, default: false }
    },
    activeSubscribersCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const SubscriptionTier = mongoose.model('SubscriptionTier', subscriptionTierSchema);
module.exports = SubscriptionTier;
