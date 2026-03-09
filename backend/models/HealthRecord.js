const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    type: {
        type: String,
        enum: ['prescription', 'lab_result', 'consultation_note'],
        required: true
    },
    file_url: {
        type: String,
        default: ''
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        default: null
    },
    encrypted: {
        type: Boolean,
        default: true
    },
    // Store encrypted metadata about the record
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
module.exports = HealthRecord;
