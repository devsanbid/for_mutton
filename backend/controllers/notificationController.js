const { Notification, User } = require('../models');
const { Op } = require('sequelize');

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, isRead } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    let where = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const notifications = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset: offset
    });

    const unreadCount = await Notification.count({
      where: { userId, isRead: false }
    });

    res.json({
      notifications: notifications.rows,
      totalCount: notifications.count,
      unreadCount,
      currentPage: pageNum,
      totalPages: Math.ceil(notifications.count / limitNum)
    });
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.update(
      { isRead: true },
      { where: { id, userId } }
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.destroy({ where: { id, userId } });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createNotification = async (req, res) => {
  try {
    const { title, message, type, userId, userRole } = req.body;
    const adminId = req.user.id;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create notifications' });
    }

    let targetUsers = [];

    if (userId) {
      targetUsers = [{ id: userId }];
    } else if (userRole) {
      targetUsers = await User.findAll({
        where: { role: userRole },
        attributes: ['id']
      });
    } else {
      targetUsers = await User.findAll({
        where: { role: { [Op.ne]: 'admin' } },
        attributes: ['id']
      });
    }

    const notifications = targetUsers.map(user => ({
      title,
      message,
      type: type || 'general',
      userId: user.id
    }));

    await Notification.bulkCreate(notifications);

    res.status(201).json({
      message: `Notification sent to ${targetUsers.length} user(s)`,
      count: targetUsers.length
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalNotifications = await Notification.count({
      where: { userId }
    });

    const unreadNotifications = await Notification.count({
      where: { userId, isRead: false }
    });

    const notificationsByType = await Notification.findAll({
      where: { userId },
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['type']
    });

    res.json({
      totalNotifications,
      unreadNotifications,
      readNotifications: totalNotifications - unreadNotifications,
      notificationsByType
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminNotifications = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 20, type, search, isRead } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    let where = {};
    if (type && type !== 'all') {
      where.type = type;
    }
    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }
    if (search) {
      where[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { message: { [require('sequelize').Op.iLike]: `%${search}%` } }
      ];
    }

    const notifications = await Notification.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset: offset
    });

    const notificationStats = await Notification.findAll({
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['type']
    });

    const unreadCount = await Notification.count({
      where: { isRead: false }
    });

    res.json({
      notifications: notifications.rows,
      totalCount: notifications.count,
      currentPage: pageNum,
      totalPages: Math.ceil(notifications.count / limitNum),
      unreadCount,
      stats: notificationStats
    });
  } catch (error) {
    console.error('Get admin notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getNotificationStats,
  getAdminNotifications
};