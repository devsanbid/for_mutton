const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'heavenstay_secret_key_2024';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    console.log('Auth middleware - User found:', user ? `${user.email} (${user.role})` : 'No');
    
    if (!user) {
      console.log('Auth middleware - User not found for token');
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Auth middleware - Token verification error:', error.message);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    console.log('Authorize middleware - Required roles:', roles);
    console.log('Authorize middleware - User role:', req.user ? req.user.role : 'No user');
    
    if (!req.user) {
      console.log('Authorize middleware - No user found');
      return res.status(401).json({ message: 'Access denied. Please login.' });
    }

    if (!roles.includes(req.user.role)) {
      console.log('Authorize middleware - Role not authorized:', req.user.role, 'not in', roles);
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    console.log('Authorize middleware - Access granted');
    next();
  };
};

const checkHotelerApproval = (req, res, next) => {
  if (req.user.role === 'hotelier' && req.user.status !== 'approved') {
    return res.status(403).json({ 
      message: 'Your account is pending approval. Please wait for admin approval.',
      status: req.user.status
    });
  }
  next();
};

module.exports = { auth, authorize, checkHotelerApproval };