const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    variety: { type: String },
    plantingDate: { type: Date, required: true },
    expectedHarvestDate: { type: Date },
    predictedYield: { type: Number },
    healthStatus: { type: String, enum: ['excellent', 'good', 'fair', 'poor'], default: 'good' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Crop', CropSchema);
