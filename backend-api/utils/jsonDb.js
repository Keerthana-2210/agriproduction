const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

// Ensure db exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
        users: [],
        sensors: [],
        jobs: [],
        crops: []
    }, null, 2));
}

class Collection {
    constructor(name) {
        this.name = name;
    }

    _read() {
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        return data[this.name] || [];
    }

    _write(items) {
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        data[this.name] = items;
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    }

    async find(query = {}) {
        let items = this._read();
        Object.entries(query).forEach(([key, value]) => {
            items = items.filter(item => item[key] === value);
        });
        return {
            sort: (sortSpec) => {
                // Simplified sort for timestamp/createdAt
                const key = Object.keys(sortSpec)[0];
                const order = sortSpec[key];
                items.sort((a, b) => {
                    const valA = new Date(a[key] || 0);
                    const valB = new Date(b[key] || 0);
                    return order === -1 ? valB - valA : valA - valB;
                });
                return {
                    limit: (n) => items.slice(0, n),
                    then: (fn) => Promise.resolve(fn(items))
                };
            },
            limit: (n) => items.slice(0, n),
            then: (fn) => Promise.resolve(fn(items))
        };
    }

    async findOne(query = {}) {
        const items = this._read();
        return items.find(item => {
            return Object.entries(query).every(([key, value]) => item[key] === value);
        });
    }

    async findById(id) {
        const items = this._read();
        return items.find(item => item._id === id);
    }

    async create(data) {
        const items = this._read();
        const newItem = {
            ...data,
            _id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        this._write(items);
        return newItem;
    }

    // This allows `item.save()` pattern
    _proxy(item) {
        return {
            ...item,
            save: async () => {
                const items = this._read();
                const index = items.findIndex(i => i._id === item._id);
                if (index !== -1) {
                    items[index] = { ...item, updatedAt: new Date().toISOString() };
                } else {
                    items.push({ ...item, _id: item._id || Math.random().toString(36).substr(2, 9) });
                }
                this._write(items);
                return item;
            }
        };
    }
}

module.exports = {
    User: new Collection('users'),
    SensorData: new Collection('sensors'),
    Job: new Collection('jobs'),
    Crop: new Collection('crops')
};
