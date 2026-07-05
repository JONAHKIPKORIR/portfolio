require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if super admin already exists
        const existingAdmin = await Admin.findOne({ role: 'super_admin' });
        if (existingAdmin) {
            console.log('⚠️ Super Admin already exists');
            console.log('📧 Email:', existingAdmin.email);
            console.log('👑 Role:', existingAdmin.role);
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin123456', salt);

        // Create Super Admin
        const admin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@portfolio.com',
            password: hashedPassword,
            role: 'super_admin',
            isActive: true
        });

        console.log('✅ Super Admin created successfully!');
        console.log('📧 Email: admin@portfolio.com');
        console.log('🔑 Password: Admin123456');
        console.log('👑 Role: super_admin');
        console.log('⚠️ Please change this password after first login!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedSuperAdmin();