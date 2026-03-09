const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    business_name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['pharmacy', 'clinic', 'guide', 'lab', 'hospital'],
        required: true,
        index: true
    },
    pin_code: {
        type: String,
        required: true,
        index: true
    },
    verified: {
        type: Boolean,
        default: false,
        index: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    // Contact & location details
    email: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    gst_number: {
        type: String,
        default: ''
    },
    // Operating details
    working_hours: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    services: [{
        type: String
    }],
    description: {
        type: String,
        default: ''
    },
    photos: [{
        type: String
    }],
    live_since: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Compound index for hyperlocal queries
partnerSchema.index({ pin_code: 1, type: 1, verified: 1 });

const Partner = mongoose.model('Partner', partnerSchema);
module.exports = Partner;
