const db = require('../utils/jsonDb');

function UserFactory(data) {
    if (!data) return null;
    let instance = { ...data };
    instance.save = async function() {
        if (this._id) {
            const items = await db.User._read();
            const idx = items.findIndex(i => i._id === this._id);
            if (idx !== -1) {
                items[idx] = { ...this, updatedAt: new Date().toISOString() };
                db.User._write(items);
            }
            return this;
        } else {
            const newUser = await db.User.create(this);
            Object.assign(this, newUser);
            return this;
        }
    };
    return instance;
}

UserFactory.findOne = async (query) => {
    const data = await db.User.findOne(query);
    return data ? UserFactory(data) : null;
};

UserFactory.findById = async (id) => {
    const data = await db.User.findById(id);
    return data ? UserFactory(data) : null;
};

UserFactory.create = async (data) => {
    const newUser = await db.User.create(data);
    return UserFactory(newUser);
};

module.exports = UserFactory;
