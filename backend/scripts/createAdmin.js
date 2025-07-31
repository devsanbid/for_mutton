require('dotenv').config();
const { User } = require('../models');
const { sequelize } = require('../database/db');

const createAdminAccount = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';
    const adminPhone = process.env.ADMIN_PHONE || '+977-9800000000';

    const existingAdmin = await User.findOne({ 
      where: { email: adminEmail } 
    });

    if (existingAdmin) {
      console.log(`Admin account with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      phone: adminPhone,
      role: 'admin',
      status: 'approved',
      isEmailVerified: true
    });

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Name:', adminUser.name);
    console.log('📱 Phone:', adminUser.phone);
    console.log('🛡️ Role:', adminUser.role);
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the default password after first login!');
    console.log('💡 You can set custom admin credentials using environment variables:');
    console.log('   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_PHONE');

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    if (error.name === 'SequelizeValidationError') {
      error.errors.forEach(err => {
        console.error(`   - ${err.path}: ${err.message}`);
      });
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

if (require.main === module) {
  createAdminAccount();
}

module.exports = createAdminAccount;
