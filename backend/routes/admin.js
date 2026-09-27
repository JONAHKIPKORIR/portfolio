const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const Message = require('../models/Message');
const { protect, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// ========== MULTER CONFIGURATION ==========
// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const imageDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);

// Storage for CVs (PDFs)
const cvStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, 'cv.pdf') // Always save as cv.pdf
});

// Storage for Project Images
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imageDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filters
const cvFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for CV'), false);
    }
};

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const uploadCV = multer({ storage: cvStorage, fileFilter: cvFilter });
const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter });

// ========== ADMIN LOGIN ==========
router.post('/login', async (req, res) => {
    console.log('🔐 Admin login attempt:', req.body.email);
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email, isActive: true });
        if (!admin) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        admin.lastLogin = new Date();
        await admin.save();
        
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== GET CURRENT ADMIN ==========
router.get('/me', protect, async (req, res) => {
    res.json({ success: true, admin: req.admin });
});

// ========== GET ALL ADMINS (Super Admin only) ==========
router.get('/admins', protect, requireSuperAdmin, async (req, res) => {
    try {
        const admins = await Admin.find({ _id: { $ne: req.admin._id } })
            .select('-password')
            .sort('-createdAt');
        res.json({ success: true, admins });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== CREATE ADMIN USER (Super Admin only) ==========
router.post('/admins', protect, requireSuperAdmin, async (req, res) => {
    try {
        const { name, email, password, role = 'admin' } = req.body;
        
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, error: 'Admin already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role,
            createdBy: req.admin._id
        });
        
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== DELETE ADMIN USER (Super Admin only) ==========
router.delete('/admins/:id', protect, requireSuperAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }
        
        if (admin._id.toString() === req.admin._id.toString()) {
            return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
        }
        
        await admin.deleteOne();
        res.json({ success: true, message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== UPDATE ADMIN ROLE (Super Admin only) ==========
router.put('/admins/:id/role', protect, requireSuperAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        
        if (!admin) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }
        
        res.json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== STATISTICS (Protected) ==========
router.get('/stats', protect, async (req, res) => {
    try {
        const [projects, blogPosts, messages, unreadMessages, totalAdmins] = await Promise.all([
            Project.countDocuments(),
            BlogPost.countDocuments(),
            Message.countDocuments(),
            Message.countDocuments({ read: false }),
            Admin.countDocuments()
        ]);
        res.json({
            success: true,
            data: {
                projects,
                blogPosts,
                messages,
                unreadMessages,
                totalAdmins,
                isSuperAdmin: req.admin.role === 'super_admin'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== PROJECT MANAGEMENT (Protected) ==========
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

// ========== IMAGE UPLOAD (Protected) ==========
router.post('/upload', protect, uploadImage.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        // Return the relative path. The frontend will prepend the API URL.
        const filePath = `/uploads/images/${req.file.filename}`;
        res.json({ success: true, url: filePath });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== BLOG MANAGEMENT ==========
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

// ========== MESSAGES MANAGEMENT ==========
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

// ========== CV MANAGEMENT ==========
router.get('/cv', protect, async (req, res) => {
    try {
        const cvPath = path.join(uploadDir, 'cv.pdf');
        if (fs.existsSync(cvPath)) {
            res.json({ success: true, hasCV: true, url: '/api/admin/cv/download' });
        } else {
            res.json({ success: true, hasCV: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/cv/download', async (req, res) => {
    try {
        const cvPath = path.join(uploadDir, 'cv.pdf');
        res.download(cvPath, 'Jonah_Kiplimo_CV.pdf');
    } catch (error) {
        res.status(404).json({ success: false, error: 'CV not found' });
    }
});

router.post('/cv/upload', protect, uploadCV.single('cv'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
        res.json({ success: true, message: 'CV uploaded successfully!', url: '/api/admin/cv/download' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;