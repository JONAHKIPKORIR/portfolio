const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }
        const savedMessage = await Message.create({ name, email, message });
        res.status(201).json({ success: true, message: 'Message sent successfully!', data: { id: savedMessage._id } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
