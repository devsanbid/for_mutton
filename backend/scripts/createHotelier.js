require('dotenv').config();
const { User } = require('../models');
const { sequelize } = require('../database/db');

const createHotelierAccount = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const hotelierEmail = process.env.HOTELIER_EMAIL || 'hotelier@heavenstay.com';
    const hotelierPassword = process.env.HOTELIER_PASSWORD || 'hotelier123';
    const hotelierName = process.env.HOTELIER_NAME || 'Test Hotelier';
    const hotelierPhone = process.env.HOTELIER_PHONE || '+977-9800000001';

    const existingHotelier = await User.findOne({ 
      where: { email: hotelierEmail } 
    });

    if (existingHotelier) {
      console.log(`Hotelier account with email ${hotelierEmail} already exists.`);
      if (existingHotelier.status !== 'approved') {
        await User.update(
          { status: 'approved' },
          { where: { id: existingHotelier.id } }
        );
        console.log(`✅ Existing hotelier account has been approved!`);
      }
      process.exit(0);
    }

    const hotelierUser = await User.create({
      name: hotelierName,
      email: hotelierEmail,
      password: hotelierPassword,
      phone: hotelierPhone,
      role: 'hotelier',
      status: 'approved',
      isEmailVerified: true
    });

    console.log('✅ Approved hotelier account created successfully!');
    console.log('📧 Email:', hotelierUser.email);
    console.log('🔑 Password:', hotelierPassword);
    console.log('👤 Name:', hotelierUser.name);
    console.log('📱 Phone:', hotelierUser.phone);
    console.log('🛡️ Role:', hotelierUser.role);
    console.log('✅ Status:', hotelierUser.status);
    console.log('');
    console.log('💡 You can set custom hotelier credentials using environment variables:');
    console.log('   HOTELIER_EMAIL, HOTELIER_PASSWORD, HOTELIER_NAME, HOTELIER_PHONE');

  } catch (error) {
    console.error('❌ Error creating hotelier account:', error.message);
    if (error.name === 'SequelizeValidationError') {
      error.errors.forEach(err => {
        console.error(`   - ${err.path}: ${err.message}`);
      });
    }
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

createHotelierAccount();