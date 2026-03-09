const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/authMiddleware');
const HealthRecord = require('../models/HealthRecord');
const Partner = require('../models/Partner');
const { encrypt, decrypt } = require('../utils/encryption');

// @desc    Get user's health records
// @route   GET /api/health/records
// @access  Private
router.get('/records', protect, asyncHandler(async (req, res) => {
    const records = await HealthRecord.find({ user_id: req.user._id })
        .sort({ createdAt: -1 });

    // Decrypt file URLs for viewing
    const decryptedRecords = records.map(record => {
        const obj = record.toObject();
        if (obj.file_url && obj.encrypted) {
            try {
                obj.file_url = decrypt(obj.file_url, req.user._id.toString());
            } catch (e) {
                obj.file_url = '[encrypted — decryption failed]';
            }
        }
        return obj;
    });

    res.json(decryptedRecords);
}));

// @desc    Add a health record (encrypted)
// @route   POST /api/health/records
// @access  Private
router.post('/records', protect, asyncHandler(async (req, res) => {
    const { type, file_url, doctor_id, metadata } = req.body;

    if (!type || !['prescription', 'lab_result', 'consultation_note'].includes(type)) {
        res.status(400);
        throw new Error('Type must be: prescription, lab_result, or consultation_note');
    }

    // Encrypt file URL at rest
    const encryptedFileUrl = file_url ? encrypt(file_url, req.user._id.toString()) : '';

    const record = await HealthRecord.create({
        user_id: req.user._id,
        type,
        file_url: encryptedFileUrl,
        doctor_id: doctor_id || null,
        encrypted: true,
        metadata: metadata || {}
    });

    res.status(201).json(record);
}));

// @desc    Delete a health record
// @route   DELETE /api/health/records/:id
// @access  Private
router.delete('/records/:id', protect, asyncHandler(async (req, res) => {
    const record = await HealthRecord.findOne({ _id: req.params.id, user_id: req.user._id });

    if (!record) {
        res.status(404);
        throw new Error('Health record not found');
    }

    await HealthRecord.deleteOne({ _id: record._id });
    res.json({ message: 'Health record deleted' });
}));

// @desc    SOS Pharmacy — find open pharmacies within pin code area
// @route   GET /api/health/sos-pharmacy?pin_code=411001
// @access  Private
router.get('/sos-pharmacy', protect, asyncHandler(async (req, res) => {
    const pinCode = req.query.pin_code || req.user.pin_code;

    if (!pinCode) {
        res.status(400);
        throw new Error('Pin code is required for SOS Pharmacy');
    }

    // Find nearby pharmacies that are verified
    const pharmacies = await Partner.find({
        type: 'pharmacy',
        pin_code: pinCode,
        verified: true
    }).sort({ rating: -1 }).limit(10);

    res.json(pharmacies);
}));

module.exports = router;
