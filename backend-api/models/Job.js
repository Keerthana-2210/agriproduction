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
    // db.Job.find returns a thenable that resolves to an array
    const res = await db.Job.find(query);
    return res.map(i => JobFactory(i));
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
