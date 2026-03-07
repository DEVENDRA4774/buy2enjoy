const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    storeName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Retail', 'Medical', 'Transit', 'Entertainment', 'Service'],
        required: true
    },
    verifiedBadge: {
        type: String,
        enum: ['Top Rated Seller', 'License Verified', 'Safety Checked', 'Standard'],
        default: 'Standard'
    },
    strikeCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    totalSales: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware to automate penalty box
vendorProfileSchema.pre('save', function (next) {
    if (this.strikeCount >= 3) {
        this.isActive = false;
    }
    next();
});

const VendorProfile = mongoose.model('VendorProfile', vendorProfileSchema);
module.exports = VendorProfile;
