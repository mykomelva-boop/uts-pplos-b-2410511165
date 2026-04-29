const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');

const tokenBlacklist = new Set();
const refreshTokenStore = new Map();

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email, dan password wajib diisi' 
      });
    }

    if (password.length < 6) {
      return res.status(422).json({ 
        message: 'Password minimal 6 karakter' 
      });
    }

    const existing = userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      oauth_provider: null,
      avatar: null,
      created_at: new Date().toISOString()
    };

    userModel.createUser(newUser);

    return res.status(201).json({
      message: 'Registrasi berhasil',
      user: { id: newUser.id, name, email }
    });

  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const user = userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = uuidv4();
    refreshTokenStore.set(refreshToken, {
      userId: user.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: 'Login berhasil',
      access_token: accessToken,
      refresh_token: refreshToken,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const refresh = (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ message: 'Refresh token wajib diisi' });
  }

  const tokenData = refreshTokenStore.get(refresh_token);
  if (!tokenData) {
    return res.status(401).json({ message: 'Refresh token tidak valid' });
  }

  if (Date.now() > tokenData.expiresAt) {
    refreshTokenStore.delete(refresh_token);
    return res.status(401).json({ message: 'Refresh token sudah expired' });
  }

  const user = userModel.findById(tokenData.userId);
  if (!user) {
    return res.status(401).json({ message: 'User tidak ditemukan' });
  }

  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return res.status(200).json({
    access_token: newAccessToken
  });
};

const logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token tidak ditemukan' });
  }

  tokenBlacklist.add(token);

  const { refresh_token } = req.body;
  if (refresh_token) {
    refreshTokenStore.delete(refresh_token);
  }

  return res.status(200).json({ message: 'Logout berhasil' });
};

const profile = (req, res) => {
  const user = userModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }
  const { password, ...userData } = user;
  return res.status(200).json({ user: userData });
};

module.exports = { register, login, refresh, logout, profile, tokenBlacklist };