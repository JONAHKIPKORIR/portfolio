const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'admin' }
}, { timestamps: true });

// No pre-save middleware
// No comparePassword method (we'll compare in controller)

module.exports = mongoose.model('Admin', adminSchema);