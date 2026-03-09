const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/authMiddleware');
const { verifyWebhookSignature, verifyPaymentSignature } = require('../utils/razorpayVerify');
const Order = require('../models/Order');

/**
 * POST /api/payments/verify
 * Verify payment signature after Razorpay checkout on frontend.
 */
router.post('/verify', protect, asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
        res.status(400);
        throw new Error('Payment verification failed — signature mismatch');
    }

    // Mark order as paid
    if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: razorpay_payment_id,
                status: 'completed',
                update_time: new Date().toISOString()
            };
            await order.save();
        }
    }

    res.json({ success: true, message: 'Payment verified successfully' });
}));

/**
 * POST /api/payments/webhook
 * Razorpay webhook handler — called by Razorpay servers.
 * Verifies signature before processing any event.
 */
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        res.status(400);
        throw new Error('Missing signature or webhook secret');
    }

    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const isValid = verifyWebhookSignature(body, signature, webhookSecret);

    if (!isValid) {
        res.status(400);
        throw new Error('Webhook signature verification failed');
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Handle different webhook events
    switch (event.event) {
        case 'payment.captured': {
            const paymentEntity = event.payload.payment.entity;
            const receiptId = paymentEntity.notes?.orderId;
            if (receiptId) {
                const order = await Order.findById(receiptId);
                if (order && !order.isPaid) {
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    order.paymentResult = {
                        id: paymentEntity.id,
                        status: 'captured',
                        update_time: new Date().toISOString()
                    };
                    await order.save();
                }
            }
            break;
        }

        case 'payment.failed': {
            const paymentEntity = event.payload.payment.entity;
            console.log(`Payment failed: ${paymentEntity.id}`, paymentEntity.error_description);
            break;
        }

        case 'refund.processed': {
            const refundEntity = event.payload.refund.entity;
            console.log(`Refund processed: ${refundEntity.id}`);
            break;
        }

        default:
            console.log(`Unhandled webhook event: ${event.event}`);
    }

    // Always respond 200 to acknowledge receipt (Razorpay retries on non-2xx)
    res.status(200).json({ received: true });
}));

/**
 * POST /api/payments/create-order
 * Create a Razorpay order (replaces the old mocked create-split-order).
 */
router.post('/create-order', protect, asyncHandler(async (req, res) => {
    const { amount, currency, receipt, notes } = req.body;

    // In production, create order via Razorpay SDK:
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const order = await razorpay.orders.create({ amount: amount * 100, currency, receipt, notes });
    // res.json(order);

    // Mock for development
    res.json({
        id: `order_${Date.now()}`,
        amount: amount * 100,
        currency: currency || 'INR',
        receipt,
        status: 'created',
        notes,
        message: 'Development mock — integrate Razorpay SDK for production'
    });
}));

module.exports = router;
