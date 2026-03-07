const mongoose = require('mongoose');

const sponsoredListingSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'VendorProfile'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Optional: Could be a general service or specific product
    },
    targetKeywords: [
        { type: String, required: true } // e.g., ['Headphones', 'Tech', 'Cyberpunk']
    ],
    bidPerClick: {
        type: Number,
        required: true // e.g., 0.50 ($0.50 CPC)
    },
    dailyBudgetCap: {
        type: Number,
        required: true
    },
    budgetSpentToday: {
        type: Number,
        default: 0
    },
    totalClicks: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Middleware to auto-pause if budget is exhausted
sponsoredListingSchema.pre('save', function (next) {
    if (this.budgetSpentToday >= this.dailyBudgetCap) {
        this.isActive = false;
    }
    next();
});

const SponsoredListing = mongoose.model('SponsoredListing', sponsoredListingSchema);
module.exports = SponsoredListing;
