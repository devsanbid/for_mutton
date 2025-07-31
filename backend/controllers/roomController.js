const { Room, Hotel, Booking } = require('../models');
const { Op } = require('sequelize');

const createRoom = async (req, res) => {
  try {
    const { name, type, description, price, capacity, size, amenities, totalRooms } = req.body;
    const { hotelId } = req.params;
    const hotelierId = req.user.id;

    const hotel = await Hotel.findOne({
      where: { id: hotelId, hotelierId }
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const room = await Room.create({
      name,
      type,
      description,
      price,
      capacity,
      size,
      amenities: amenities ? JSON.parse(amenities) : [],
      images,
      totalRooms,
      hotelId
    });

    res.status(201).json({
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkIn, checkOut } = req.query;

    let where = { hotelId, isAvailable: true };

    const rooms = await Room.findAll({
      where,
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'location']
        }
      ]
    });

    if (checkIn && checkOut) {
      const bookedRooms = await Booking.findAll({
        where: {
          hotelId,
          status: { [Op.in]: ['upcoming', 'checked-in'] },
          [Op.or]: [
            {
              checkIn: {
                [Op.between]: [checkIn, checkOut]
              }
            },
            {
              checkOut: {
                [Op.between]: [checkIn, checkOut]
              }
            },
            {
              [Op.and]: [
                { checkIn: { [Op.lte]: checkIn } },
                { checkOut: { [Op.gte]: checkOut } }
              ]
            }
          ]
        },
        attributes: ['roomId']
      });

      const bookedRoomCounts = {};
      bookedRooms.forEach(booking => {
        bookedRoomCounts[booking.roomId] = (bookedRoomCounts[booking.roomId] || 0) + 1;
      });

      const availableRooms = rooms.map(room => {
        const bookedCount = bookedRoomCounts[room.id] || 0;
        const availableCount = room.totalRooms - bookedCount;
        return {
          ...room.toJSON(),
          availableRooms: Math.max(0, availableCount),
          isAvailable: availableCount > 0
        };
      }).filter(room => room.isAvailable);

      return res.json({ rooms: availableRooms });
    }

    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms by hotel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getHotelerRooms = async (req, res) => {
  try {
    const hotelierId = req.user.id;

    const rooms = await Room.findAll({
      include: [
        {
          model: Hotel,
          as: 'hotel',
          where: { hotelierId },
          attributes: ['id', 'name', 'location']
        }
      ]
    });

    res.json({ rooms });
  } catch (error) {
    console.error('Get hoteler rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, price, capacity, size, amenities, totalRooms, isAvailable } = req.body;
    const hotelierId = req.user.id;

    const room = await Room.findOne({
      include: [
        {
          model: Hotel,
          as: 'hotel',
          where: { hotelierId }
        }
      ],
      where: { id }
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found or unauthorized' });
    }

    const updateData = {
      name,
      type,
      description,
      price,
      capacity,
      size,
      totalRooms,
      isAvailable
    };

    if (amenities) {
      updateData.amenities = JSON.parse(amenities);
    }

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    await Room.update(updateData, { where: { id } });

    const updatedRoom = await Room.findByPk(id, {
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'location']
        }
      ]
    });

    res.json({
      message: 'Room updated successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelierId = req.user.id;

    const room = await Room.findOne({
      include: [
        {
          model: Hotel,
          as: 'hotel',
          where: { hotelierId }
        }
      ],
      where: { id }
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found or unauthorized' });
    }

    const activeBookings = await Booking.findOne({
      where: {
        roomId: id,
        status: { [Op.in]: ['upcoming', 'checked-in'] }
      }
    });

    if (activeBookings) {
      return res.status(400).json({ 
        message: 'Cannot delete room with active bookings. Please wait for bookings to complete.' 
      });
    }

    await Room.destroy({ where: { id } });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id, {
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'location', 'policies']
        }
      ]
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRoom,
  getRoomsByHotel,
  getHotelerRooms,
  updateRoom,
  deleteRoom,
  getRoomById
};