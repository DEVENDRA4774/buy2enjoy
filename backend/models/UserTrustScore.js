const mongoose = require('mongoose');

const userTrustScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    refundRequests: {
        type: Number,
        default: 0
    },
    refundRequestRatio: {
        type: Number,
        default: 0
    },
    trustScore: {
        type: Number,
        default: 100, // Starts at 100, decreases with bad behavior
        min: 0,
        max: 100
    },
    flaggedForReview: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Automate flag generation if refund ratio is too high
userTrustScoreSchema.pre('save', function (next) {
    if (this.totalOrders > 0) {
        this.refundRequestRatio = (this.refundRequests / this.totalOrders) * 100;

        // If a user refunds >= 90% of their orders (with > 3 orders to avoid early flags), flag them
        if (this.totalOrders >= 3 && this.refundRequestRatio >= 90) {
            this.flaggedForReview = true;
        }
    }
    next();
});

const UserTrustScore = mongoose.model('UserTrustScore', userTrustScoreSchema);
module.exports = UserTrustScore;
