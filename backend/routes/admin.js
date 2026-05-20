const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ success: false, error: 'Invalid credentials' });
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });
        const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, admin: { id: admin._id, name: admin.name, email: admin.email } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/me', protect, async (req, res) => {
    res.json({ success: true, admin: req.admin });
});

router.get('/stats', protect, async (req, res) => {
    try {
        const [projects, blogPosts, messages, unreadMessages] = await Promise.all([
            Project.countDocuments(),
            BlogPost.countDocuments(),
            Message.countDocuments(),
            Message.countDocuments({ read: false })
        ]);
        res.json({ success: true, data: { projects, blogPosts, messages, unreadMessages } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/projects', protect, async (req, res) => {
    try {
        const projects = await Project.find().sort('-createdAt');
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/projects', protect, async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/projects/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/projects/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
        res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/blog', protect, async (req, res) => {
    try {
        const posts = await BlogPost.find().sort('-createdAt');
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/blog', protect, async (req, res) => {
    try {
        const post = await BlogPost.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/blog/:id', protect, async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/blog/:id', protect, async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/messages', protect, async (req, res) => {
    try {
        const messages = await Message.find().sort('-createdAt');
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/messages/:id/read', protect, async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/messages/:id', protect, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
