const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const SensorData = require('./models/SensorData');
const Job = require('./models/Job');

const DB_PATH = path.join(__dirname, 'db.json');

const seed = async () => {
    try {
        console.log('🌱 Starting JSON Seeding process...');

        // Clear existing JSON data (reset the file)
        fs.writeFileSync(DB_PATH, JSON.stringify({
            users: [],
            sensors: [],
            jobs: [],
            crops: []
        }, null, 2));
        console.log('🧹 Database cleared.');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const farmer = await User.findOne({ email: 'farmer@example.com' }); // Check trigger
        const newFarmer = await User.create({
            name: 'John Farmer',
            email: 'farmer@example.com',
            password,
            role: 'farmer',
            location: 'Green Valley, CA'
        });

        const newWorker = await User.create({
            name: 'Sam Worker',
            email: 'worker@example.com',
            password,
            role: 'labourer',
            location: 'Nearby Town, CA'
        });

        console.log('👥 Users created.');

        // Generate Sensor Data for Farmer
        const now = new Date();
        for (let i = 0; i < 20; i++) {
            const timestamp = new Date(now.getTime() - i * 3600000).toISOString();
            await SensorData.create({
                farmerId: newFarmer._id,
                soilPh: 6.2 + Math.random() * 0.6,
                moisture: 35 + Math.random() * 30,
                temperature: 22 + Math.random() * 8,
                humidity: 50 + Math.random() * 20,
                npk: {
                    n: 40 + Math.random() * 20,
                    p: 40 + Math.random() * 20,
                    k: 40 + Math.random() * 20
                },
                timestamp
            });
        }
        console.log('📊 Sensor telemetry data generated.');

        // Generate Sample Jobs
        await Job.create({
            employerId: newFarmer._id,
            title: 'Wheat Harvesting',
            description: 'Looking for 5 experienced harvesters for the upcoming wheat season.',
            location: 'Green Valley, CA',
            salary: '$20/hr',
            type: 'Daily Wage'
        });

        await Job.create({
            employerId: newFarmer._id,
            title: 'Soil Preparation',
            description: 'Need help preparing 10 acres for the next planting cycle.',
            location: 'Green Valley, CA',
            salary: '$18/hr',
            type: 'Part-time'
        });

        console.log('💼 Marketplace jobs created.');
        console.log('✅ Seeding complete! Database is ready.');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
};

seed();
