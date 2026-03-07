const mongoose = require('mongoose');

const vendorKycSchema = new mongoose.Schema({
    vendorProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'VendorProfile'
    },
    razorpayLinkedAccountId: {
        type: String // The `acc_xxxxxxxxxxxxxx` ID assigned by Razorpay after KYC
    },
    businessDetails: {
        legalName: { type: String, required: true },
        gstin: { type: String }, // Optional, as some micro-vendors may not have GST
        panCardNumber: { type: String, required: true }
    },
    bankDetails: {
        accountName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true }
    },
    verificationStatus: {
        type: String,
        enum: ['Pending_Submission', 'Submitted_To_Gateway', 'Verified', 'Rejected', 'Needs_Clarification'],
        default: 'Pending_Submission'
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
});

const VendorKYC = mongoose.model('VendorKYC', vendorKycSchema);
module.exports = VendorKYC;
