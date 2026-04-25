const db = require('../utils/jsonDb');

function SensorDataFactory(data) {
    let instance = { ...data };
    instance.save = async function() {
        const result = await db.SensorData.create(this);
        Object.assign(this, result);
        return this;
    };
    return instance;
}

SensorDataFactory.find = async (query) => {
    const res = await db.SensorData.find(query);
    return res.map(i => SensorDataFactory(i));
};

SensorDataFactory.create = async (data) => {
    const res = await db.SensorData.create(data);
    return SensorDataFactory(res);
};

module.exports = SensorDataFactory;
