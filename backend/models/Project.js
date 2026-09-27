const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fullDescription: { type: String, required: true },
    // Image can be a URL or an uploaded file path
    image: { type: String, default: '' }, 
    techStack: [{ type: String }],
    githubUrl: { type: String, required: true },
    liveUrl: { type: String, default: '' },
    category: { 
        type: String, 
        enum: ['fullstack', 'frontend', 'backend', 'vanilla-js'], 
        default: 'fullstack' 
    },
    // Status for Draft/Published workflow
    status: { 
        type: String, 
        enum: ['draft', 'published'], 
        default: 'published' 
    },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);