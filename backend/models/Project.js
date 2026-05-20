const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fullDescription: { type: String, required: true },
    image: { type: String, required: true },
    techStack: [{ type: String }],
    githubUrl: { type: String, required: true },
    liveUrl: { type: String, default: '' },
    category: { type: String, enum: ['fullstack', 'frontend', 'backend'], default: 'fullstack' },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
