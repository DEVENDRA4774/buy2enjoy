const crypto = require('crypto');

/**
 * Verify Razorpay webhook signature.
 * Razorpay signs webhooks with HMAC-SHA256 using your webhook secret.
 * 
 * @param {string} body - Raw request body string
 * @param {string} signature - X-Razorpay-Signature header value
 * @param {string} secret - Your Razorpay webhook secret from dashboard
 * @returns {boolean} Whether the signature is valid
 */
const verifyWebhookSignature = (body, signature, secret) => {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
};

/**
 * Verify Razorpay payment signature for order completion.
 * Used after checkout to verify the payment was genuine.
 * 
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature from checkout response
 * @returns {boolean} Whether the signature is valid
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
};

module.exports = { verifyWebhookSignature, verifyPaymentSignature };
