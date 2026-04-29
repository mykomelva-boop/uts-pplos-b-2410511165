const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require('../controllers/authController');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Token sudah tidak valid (logout)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token tidak valid atau expired' });
  }
};

module.exports = { verifyToken };