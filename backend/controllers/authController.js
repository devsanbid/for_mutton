const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Notification } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'heavenstay_secret_key_2024';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

const createNotification = async (userId, title, message, type = 'general') => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'user' } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const status = role === 'hotelier' ? 'pending' : 'approved';

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      status
    });

    if (role === 'hotelier') {
      const adminUsers = await User.findAll({ where: { role: 'admin' } });
      for (const admin of adminUsers) {
        await createNotification(
          admin.id,
          'New Hotelier Registration',
          `${name} has registered as a hotelier and needs approval.`,
          'approval'
        );
      }
    }

    const token = generateToken(user.id);

    res.status(201).json({
      message: role === 'hotelier' 
        ? 'Registration successful. Please wait for admin approval.' 
        : 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role === 'hotelier' && user.status !== 'approved') {
      return res.status(403).json({ 
        message: 'Your account is pending approval. Please wait for admin approval.',
        status: user.status
      });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    const updateData = { name, phone };
    
    if (req.file) {
      updateData.avatar = req.file.path;
    }

    await User.update(updateData, { where: { id: userId } });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    await User.update(
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetPasswordExpires
      },
      { where: { id: user.id } }
    );

    res.json({
      message: 'Password reset token generated',
      resetToken
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const confirmResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    await User.update(
      {
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      },
      { where: { id: user.id } }
    );

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Confirm reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  resetPassword,
  confirmResetPassword
};