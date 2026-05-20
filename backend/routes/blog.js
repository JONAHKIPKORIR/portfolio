const express = require('express');
const BlogPost = require('../models/BlogPost');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find({ published: true }).sort('-createdAt').limit(10);
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
        post.views += 1;
        await post.save();
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
