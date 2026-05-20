const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort('-createdAt');
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/featured', async (req, res) => {
    try {
        const projects = await Project.find({ featured: true }).limit(3);
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
