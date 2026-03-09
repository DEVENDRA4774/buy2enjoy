const mongoose = require('mongoose');

const consentLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    consent_type: {
        type: String,
        enum: ['data_processing', 'marketing_emails', 'health_data_storage', 'location_tracking', 'terms_of_service'],
        required: true
    },
    granted: {
        type: Boolean,
        required: true
    },
    ip_address: {
        type: String,
        default: ''
    },
    user_agent: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Compound index for querying user's latest consents
consentLogSchema.index({ user_id: 1, consent_type: 1, createdAt: -1 });

const ConsentLog = mongoose.model('ConsentLog', consentLogSchema);
module.exports = ConsentLog;
