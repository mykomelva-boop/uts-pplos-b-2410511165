const express = require('express');
const router = express.Router();
const { getStockReport } = require('../controllers/reportController');

router.get('/stock', getStockReport);

module.exports = router;