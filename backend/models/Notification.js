const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['order_update', 'price_drop', 'booking_update', 'wallet', 'health', 'promotion', 'system'],
        required: true
    },
    read: {
        type: Boolean,
        default: false,
        index: true
    },
    // Optional: link to related resource
    action_url: {
        type: String,
        default: ''
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Compound index for fetching unread notifications per user efficiently
notificationSchema.index({ user_id: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
