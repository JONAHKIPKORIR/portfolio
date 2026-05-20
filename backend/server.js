require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5174', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000, connectTimeoutMS: 30000 })
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB error:', err.message));

app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Portfolio API running', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/health`);
});
