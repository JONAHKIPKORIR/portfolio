require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Delete existing admin
        await Admin.deleteOne({ email: 'admin@portfolio.com' });
        console.log('🗑️ Removed existing admin (if any)');

        // Hash password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin123456', salt);

        // Create admin with hashed password
        const admin = await Admin.create({
            name: 'Jonah Kiplimo',
            email: 'admin@portfolio.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('✅ Admin created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: Admin123456');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedAdmin();