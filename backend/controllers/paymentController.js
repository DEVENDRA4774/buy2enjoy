const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
// const Order = require('../models/Order'); // Import Order model
// const CommissionTier = require('../models/CommissionTier'); // Import Commission configurations

// Initialize Razorpay (Replace with environment variables in production)
/*
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
*/

/**
 * Endpoint: POST /api/payments/create-split-order
 * Description: Creates a Razorpay order and defines the split rules (Transfers) 
 * so funds are routed to the vendor's Linked Account and held in Escrow.
 */
router.post('/create-split-order', async (req, res) => {
    try {
        const { orderId, totalAmount, items } = req.body;

        // 1. In a real scenario, you query your DB for the items and their vendors.
        // For demonstration, we assume we calculated platform and vendor cuts:
        // Example: $100 total. Platform takes 10% ($10). Vendor gets $90.
        // Razorpay works in subunits (paisa/cents), so multiply by 100.

        const amountInSubunits = totalAmount * 100;

        // 2. Define the Transfers array for Razorpay Route
        const transfers = items.map(item => {
            // Calculate vendor's slice based on your CommissionTier schema logic
            const vendorPayoutInSubunits = Math.round(item.vendorPayoutAmount * 100);

            return {
                account: item.razorpayLinkedAccountId, // e.g. "acc_8xV1qY4oH1G1a9"
                amount: vendorPayoutInSubunits,
                currency: 'INR',
                notes: {
                    itemId: item.id,
                    vendorId: item.vendorId
                },
                // Hold the funds in the Nodal account until the item is delivered or service rendered!
                on_hold: true,
                // Optional: Hold until a specific timestamp (e.g., 48 hours from now)
                // on_hold_until: Math.floor(Date.now() / 1000) + (48 * 60 * 60) 
            };
        });

        // 3. Create the Razorpay Order with the Transfer instructions
        /*
        const options = {
            amount: amountInSubunits,
            currency: 'INR',
            receipt: `receipt_order_${orderId}`,
            transfers: transfers // <--- This activates Multi-Party Routing
        };

        const razorpayOrder = await razorpay.orders.create(options);
        res.status(200).json(razorpayOrder);
        */

        // Mocking the successful response for development
        res.status(200).json({
            id: 'order_mock123xyz',
            amount: amountInSubunits,
            currency: 'INR',
            status: 'created',
            transfers: transfers,
            message: "Razorpay Order created. Funds will be held in Nodal Escrow upon successful payment."
        });

    } catch (error) {
        console.error("Error creating split payment order:", error);
        res.status(500).json({ message: "Server error processing payment route." });
    }
});

/**
 * Endpoint: POST /api/payments/release-escrow
 * Description: Called by the Admin Dispute Dashboard or an automated cron job
 * when an item is delivered. Releases funds from Nodal Escrow to Vendor's Bank.
 */
router.post('/release-escrow', async (req, res) => {
    try {
        const { transferId, action } = req.body;
        // action = 'release' OR 'reverse' (refund to user)

        /*
        if(action === 'release') {
            // Release the specific transfer to the vendor
            await razorpay.transfers.edit(transferId, { on_hold: false });
            // Update DB: PayoutLog.payoutStatus = 'Transferred_To_Bank'
        } else if (action === 'reverse') {
            // Reverse the transfer back to the main node, then refund user
            await razorpay.transfers.reverse(transferId, { amount: fullAmount });
        }
        */

        res.status(200).json({ message: `Escrow Action '${action}' executed successfully on transfer ${transferId}.` });

    } catch (error) {
        console.error("Error managing escrow:", error);
        res.status(500).json({ message: "Server error managing escrow state." });
    }
});

module.exports = router;
