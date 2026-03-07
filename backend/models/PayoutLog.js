const mongoose = require('mongoose');

const payoutLogSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'VendorProfile' // Could also be a direct reference to a Vendor User
    },
    totalOrderAmount: {
        type: Number,
        required: true
    },
    platformCommissionCut: {
        type: Number,
        required: true
    },
    vendorPayoutAmount: {
        type: Number,
        required: true
    },
    payoutStatus: {
        type: String,
        enum: ['Held_In_Escrow', 'Processing', 'Transferred_To_Bank', 'Failed', 'Refunded_To_Buyer'],
        default: 'Held_In_Escrow'
    },
    escrowReleaseDate: {
        type: Date,
        required: true // Automatically calculated based on category (e.g., 48hrs after delivery, 2hrs after appointment)
    },
    transactionHash_GatewayId: {
        type: String // Stripe Connect Transfer ID or Razorpay Route ID
    }
}, {
    timestamps: true
});

const PayoutLog = mongoose.model('PayoutLog', payoutLogSchema);
module.exports = PayoutLog;
