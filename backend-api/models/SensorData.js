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
    // Handle the .sort().limit() chain for Sensors specifically
    if (res.sort) {
        const originalSort = res.sort;
        res.sort = (spec) => {
            const sorted = originalSort(spec);
            const originalLimit = sorted.limit;
            sorted.limit = (n) => {
                const limited = originalLimit(n);
                return limited.map(i => SensorDataFactory(i));
            };
            return sorted;
        };
    }
    return res;
};

SensorDataFactory.create = async (data) => {
    const res = await db.SensorData.create(data);
    return SensorDataFactory(res);
};

module.exports = SensorDataFactory;
