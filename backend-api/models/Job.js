const db = require('../utils/jsonDb');

function JobFactory(data) {
    let instance = { applicants: [], ...data };
    instance.save = async function() {
        if (this._id) {
            const items = await db.Job._read();
            const idx = items.findIndex(i => i._id === this._id);
            if (idx !== -1) {
                items[idx] = { ...this, updatedAt: new Date().toISOString() };
                db.Job._write(items);
            }
            return this;
        } else {
            const result = await db.Job.create(this);
            Object.assign(this, result);
            return this;
        }
    };
    return instance;
}

JobFactory.find = async (query) => {
    const res = await db.Job.find(query);
    if (res.sort) {
        const originalSort = res.sort;
        res.sort = (spec) => {
            const sorted = originalSort(spec);
            const originalLimit = sorted.limit;
            sorted.limit = (n) => {
                const limited = originalLimit(n);
                return limited.map(i => JobFactory(i));
            };
            return sorted;
        };
        // Also handle direct .then() if no sorting/limiting is called last
        const originalThen = res.then;
        res.then = (fn) => originalThen((items) => fn(items.map(i => JobFactory(i))));
    } else {
        return res.map(i => JobFactory(i));
    }
    return res;
};

JobFactory.findById = async (id) => {
    const data = await db.Job.findById(id);
    return data ? JobFactory(data) : null;
};

JobFactory.create = async (data) => {
    const res = await db.Job.create(data);
    return JobFactory(res);
};

module.exports = JobFactory;
