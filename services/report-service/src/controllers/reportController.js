const axios = require('axios');

const getStockReport = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        
        const response = await axios.get(
            `${process.env.INVENTORY_SERVICE_URL}/stock-movements`,
            {
                headers: { Authorization: authHeader },
                params: req.query
            }
        );

        const movements = response.data.data;

        const summary = {
            total_in: movements
                .filter(m => m.type === 'in')
                .reduce((sum, m) => sum + m.quantity, 0),
            total_out: movements
                .filter(m => m.type === 'out')
                .reduce((sum, m) => sum + m.quantity, 0),
            total_movements: movements.length,
        };

        return res.status(200).json({
            summary,
            data: movements,
            page: response.data.page,
            per_page: response.data.per_page,
        });

    } catch (err) {
        return res.status(500).json({ 
            message: 'Gagal mengambil data dari inventory service',
            error: err.message 
        });
    }
};

module.exports = { getStockReport };