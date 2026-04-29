const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const oauthController = require('../controllers/oauthController');
const { verifyToken } = require('../middleware/jwtMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

router.get('/oauth/github', oauthController.githubLogin);
router.get('/oauth/github/callback', oauthController.githubCallback);

router.post('/logout', verifyToken, authController.logout);
router.get('/profile', verifyToken, authController.profile);

module.exports = router;