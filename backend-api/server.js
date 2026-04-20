const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Local JSON Database Initialized (Zero-Setup)
console.log('✅ Local JSON Database Connected');

// Basic Route
app.get('/', (req, res) => {
    res.send('Smart Agriculture API is running...');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sensors', require('./routes/sensors'));
app.use('/api/jobs', require('./routes/jobs'));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
