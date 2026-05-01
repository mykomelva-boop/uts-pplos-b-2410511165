const axios = require('axios');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');
const { refreshTokenStore } = require('./authController');

const githubLogin = (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(githubAuthUrl);
};

const githubCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Code dari GitHub tidak ditemukan' });
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const githubAccessToken = tokenResponse.data.access_token;

    if (!githubAccessToken) {
      return res.status(401).json({ message: 'Gagal mendapatkan token dari GitHub' });
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    const githubUser = userResponse.data;
    const primaryEmail = emailResponse.data.find(e => e.primary)?.email || githubUser.email;

    if (!primaryEmail) {
      return res.status(400).json({ message: 'Email GitHub tidak ditemukan' });
    }

    let user = userModel.findByEmail(primaryEmail);

    if (!user) {
      user = userModel.createUser({
        id: uuidv4(),
        name: githubUser.name || githubUser.login,
        email: primaryEmail,
        password: null,
        oauth_provider: 'github',
        avatar: githubUser.avatar_url,
        created_at: new Date().toISOString(),
      });
    } else {
      userModel.updateUser(user.id, {
        oauth_provider: 'github',
        avatar: githubUser.avatar_url,
      });
      user = userModel.findById(user.id);
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = uuidv4();
    refreshTokenStore.set(refreshToken, {
      userId: user.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login GitHub berhasil',
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: githubUser.avatar_url,
        oauth_provider: 'github',
      },
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error saat OAuth GitHub' });
  }
};

module.exports = { githubLogin, githubCallback };