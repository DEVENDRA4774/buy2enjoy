const { z } = require('zod');

const orderItemSchema = z.object({
    name: z.string().min(1, 'Item name is required'),
    qty: z.number().int().positive('Quantity must be a positive integer'),
    image: z.string().min(1, 'Item image is required'),
    price: z.number().nonnegative('Price must be non-negative'),
    product: z.string().min(1, 'Product ID is required')
});

const shippingAddressSchema = z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required')
});

const createOrderSchema = z.object({
    orderItems: z.array(orderItemSchema).min(1, 'At least one order item is required'),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.string().min(1, 'Payment method is required'),
    itemsPrice: z.number().nonnegative().optional(),
    taxPrice: z.number().nonnegative().optional(),
    shippingPrice: z.number().nonnegative().optional(),
    totalPrice: z.number().nonnegative().optional()
});

module.exports = { createOrderSchema };
