const mongoose = require('mongoose');

const disputeTicketSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'VendorProfile'
    },
    complaintText: {
        type: String,
        required: true
    },
    evidenceImages: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        enum: ['Open', 'Resolved', 'Closed'],
        default: 'Open'
    },
    resolution: {
        type: String,
        enum: ['Refunded User', 'Released to Vendor', 'Split Difference', null],
        default: null
    }
}, {
    timestamps: true
});

const DisputeTicket = mongoose.model('DisputeTicket', disputeTicketSchema);
module.exports = DisputeTicket;
