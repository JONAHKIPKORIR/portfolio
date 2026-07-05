const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect route - verify JWT token
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) {
            return res.status(401).json({ success: false, error: 'Admin not found' });
        }
        if (!admin.isActive) {
            return res.status(401).json({ success: false, error: 'Account deactivated' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// Super Admin only middleware
const requireSuperAdmin = (req, res, next) => {
    if (req.admin.role !== 'super_admin') {
        return res.status(403).json({ 
            success: false, 
            error: 'Access denied. Super Admin privileges required.' 
        });
    }
    next();
};

module.exports = { protect, requireSuperAdmin };