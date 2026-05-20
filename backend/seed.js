require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        const existingAdmin = await Admin.findOne({ email: 'admin@portfolio.com' });
        if (existingAdmin) {
            console.log('⚠️ Admin already exists');
            process.exit(0);
        }
        
        await Admin.create({
            name: 'Jonah Kiplimo',
            email: 'admin@portfolio.com',
            password: 'Admin123456'
        });
        
        console.log('✅ Admin created!');
        console.log('📧 Email: admin@portfolio.com');
        console.log('🔑 Password: Admin123456');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedAdmin();
