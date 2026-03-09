const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../validators/productValidators');

router.route('/').get(getProducts).post(protect, admin, validate(createProductSchema), createProduct);
router.route('/:id').get(getProductById).put(protect, admin, validate(updateProductSchema), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
