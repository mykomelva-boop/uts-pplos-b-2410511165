const express = require('express');
const dotenv = require('dotenv');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/reports', reportRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'Report Service is running!' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Report Service running on port ${PORT}`);
});