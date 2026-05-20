const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
