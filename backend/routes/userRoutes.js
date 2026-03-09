const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    refreshAccessToken,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    exportUserData,
    deleteUserAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { loginSchema, registerSchema } = require('../validators/userValidators');

// Public routes
router.post('/', authLimiter, validate(registerSchema), registerUser);
router.post('/login', authLimiter, validate(loginSchema), authUser);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.post('/logout', logoutUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// DPDP compliance routes
router.get('/data-export', protect, exportUserData);
router.delete('/account', protect, deleteUserAccount);

module.exports = router;
