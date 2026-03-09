const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    // Either product_id or partner_id should be set, not both
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null,
        index: true
    },
    partner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        default: null,
        index: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        default: ''
    },
    verified_purchase: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure at least one of product_id or partner_id is set
reviewSchema.pre('validate', function (next) {
    if (!this.product_id && !this.partner_id) {
        this.invalidate('product_id', 'Either product_id or partner_id must be provided');
    }
    if (this.product_id && this.partner_id) {
        this.invalidate('product_id', 'Only one of product_id or partner_id should be provided');
    }
    next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
