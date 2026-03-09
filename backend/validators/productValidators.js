const { z } = require('zod');

const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required').max(200),
    price: z.number().nonnegative('Price must be non-negative'),
    image: z.string().min(1, 'Image URL is required'),
    brand: z.string().min(1, 'Brand is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    countInStock: z.number().int().nonnegative('Stock must be non-negative'),
    discount: z.number().nonnegative().optional().default(0),
    images: z.array(z.string()).optional().default([])
});

const updateProductSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    price: z.number().nonnegative().optional(),
    image: z.string().min(1).optional(),
    brand: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    countInStock: z.number().int().nonnegative().optional(),
    discount: z.number().nonnegative().optional(),
    images: z.array(z.string()).optional()
});

module.exports = { createProductSchema, updateProductSchema };
