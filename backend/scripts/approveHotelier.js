require('dotenv').config();
const { User } = require('../models');
const { sequelize } = require('../database/db');

const approveHotelier = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: bun run scripts/approveHotelier.js <hotelier-email>');
      console.log('Example: bun run scripts/approveHotelier.js hotelier@example.com');
      process.exit(1);
    }

    const hotelier = await User.findOne({ 
      where: { email, role: 'hotelier' } 
    });

    if (!hotelier) {
      console.log(`❌ Hotelier with email ${email} not found.`);
      process.exit(1);
    }

    if (hotelier.status === 'approved') {
      console.log(`✅ Hotelier ${email} is already approved.`);
      process.exit(0);
    }

    await User.update(
      { status: 'approved' },
      { where: { id: hotelier.id } }
    );

    console.log(`✅ Hotelier ${email} has been approved successfully!`);
    console.log(`📧 Email: ${hotelier.email}`);
    console.log(`👤 Name: ${hotelier.name}`);
    console.log(`📱 Phone: ${hotelier.phone}`);
    console.log(`🛡️ Status: approved`);

  } catch (error) {
    console.error('❌ Error approving hotelier:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

approveHotelier();