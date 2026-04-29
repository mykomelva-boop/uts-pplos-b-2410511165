const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/jwtMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

router.post('/logout', verifyToken, authController.logout);
router.get('/profile', verifyToken, authController.profile);

module.exports = router;