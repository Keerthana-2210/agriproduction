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
        let data = await SensorData.find({ farmerId: req.user.id });
        // Use createdAt or timestamp for sorting
        data.sort((a, b) => new Date(b.createdAt || b.timestamp || 0) - new Date(a.createdAt || a.timestamp || 0));
        data = data.slice(0, 10);

        // Standardize timestamp for frontend Recharts
        data = data.map(d => ({
            ...d,
            timestamp: d.timestamp || d.createdAt
        }));

        // Recharts AreaChart cannot render a single data point.
        // If there's exactly 1 data point, duplicate it with an older timestamp to draw a flat line.
        if (data.length === 1) {
            const olderPoint = { ...data[0] };
            olderPoint.timestamp = new Date(new Date(data[0].timestamp).getTime() - 3600000).toISOString();
            data.push(olderPoint);
        }

        // Reverse to show oldest first on the left of the chart
        data.reverse();

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.fetchWeather = async (req, res) => {
    try {
        const { location } = req.body;
        if (!location) return res.status(400).json({ message: 'Location is required' });
        
        // Fetch real weather data from wttr.in (returns JSON without needing API key)
        const axios = require('axios');
        const response = await axios.get(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
        
        const currentCondition = response.data.current_condition[0];
        const temp = parseFloat(currentCondition.temp_C);
        const humidity = parseFloat(currentCondition.humidity);
        const precip = parseFloat(currentCondition.precipMM || 0);
        
        // Estimate moisture based on humidity and precip (simple heuristic for demonstration)
        let estimatedMoisture = 30 + (humidity * 0.2) + (precip * 5);
        if (estimatedMoisture > 100) estimatedMoisture = 100;
        
        // We log a new entry with this data. We'll use 0 for NPK/pH since weather can't determine it
        const newData = new SensorData({
            farmerId: req.user.id,
            soilPh: 0,
            moisture: estimatedMoisture,
            temperature: temp,
            humidity: humidity,
            npk: { n: 0, p: 0, k: 0 }
        });
        await newData.save();
        
        res.status(200).json({ message: 'Weather fetched and logged successfully', data: newData });
    } catch (err) {
        console.error('Weather fetch error:', err);
        res.status(500).json({ message: 'Failed to fetch weather data', error: err.message });
    }
};
