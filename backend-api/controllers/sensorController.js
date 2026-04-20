const SensorData = require('../models/SensorData');

exports.logData = async (req, res) => {
    try {
        const { soilPh, moisture, temperature, humidity, npk } = req.body;
        const newData = new SensorData({
            farmerId: req.user.id,
            soilPh,
            moisture,
            temperature,
            humidity,
            npk
        });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getLatestData = async (req, res) => {
    try {
        let data = await SensorData.find({ farmerId: req.user.id }).sort({ timestamp: -1 }).limit(10);
        
        // Smart Demo Fallback: If no data exists for this user, return sample historical data
        if (data.length === 0) {
            const now = new Date();
            data = Array.from({ length: 10 }).map((_, i) => ({
                _id: 'demo-' + i,
                farmerId: req.user.id,
                soilPh: 6.5 + (Math.random() * 0.4),
                moisture: 45 + (Math.random() * 20),
                temperature: 24 + (Math.random() * 5),
                humidity: 60 + (Math.random() * 10),
                npk: {
                    n: 50 + (Math.random() * 10),
                    p: 45 + (Math.random() * 10),
                    k: 48 + (Math.random() * 10)
                },
                timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
                isDemo: true
            }));
        }
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
