const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { message: 'Terlalu banyak request, coba lagi nanti' }
});
app.use(limiter);

const verifyJWT = (req, res, next) => {
    const openPaths = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/refresh',
        '/api/auth/oauth/github',
        '/api/auth/oauth/github/callback',
    ];

    if (openPaths.includes(req.path)) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token tidak valid atau expired' });
    }
};

app.use(verifyJWT);

app.use('/api/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/auth' },
}));

app.use('/api/inventory', createProxyMiddleware({
    target: process.env.INVENTORY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/inventory': '' },
}));

app.use('/api/reports', createProxyMiddleware({
    target: process.env.REPORT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/reports': '/reports' },
}));

app.get('/health', (req, res) => {
    res.json({ 
        status: 'API Gateway is running!',
        services: {
            auth: process.env.AUTH_SERVICE_URL,
            inventory: process.env.INVENTORY_SERVICE_URL,
            report: process.env.REPORT_SERVICE_URL,
        }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});