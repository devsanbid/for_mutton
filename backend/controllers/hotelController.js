const { Hotel, Room, User, Review, Booking } = require('../models');
const { Op } = require('sequelize');

const getAllHotels = async (req, res) => {
  try {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      amenities,
      rating,
      sortBy = 'featured',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status: 'active' };
    const include = [
      {
        model: Room,
        as: 'rooms',
        where: { isAvailable: true },
        required: false
      },
      {
        model: User,
        as: 'hotelier',
        attributes: ['name', 'email', 'phone']
      },
      {
        model: Review,
        as: 'reviews',
        include: [{
          model: User,
          as: 'user',
          attributes: ['name', 'avatar']
        }]
      }
    ];

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (rating) {
      where.rating = { [Op.gte]: parseFloat(rating) };
    }

    if (amenities) {
      const amenityList = Array.isArray(amenities) ? amenities : [amenities];
      where.amenities = { [Op.contains]: amenityList };
    }

    let order = [];
    switch (sortBy) {
      case 'price-low':
        order = [['rooms', 'price', 'ASC']];
        break;
      case 'price-high':
        order = [['rooms', 'price', 'DESC']];
        break;
      case 'rating':
        order = [['rating', 'DESC']];
        break;
      case 'featured':
      default:
        order = [['featured', 'DESC'], ['rating', 'DESC']];
        break;
    }

    const hotels = await Hotel.findAndCountAll({
      where,
      include,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    const hotelsWithMinPrice = hotels.rows.map(hotel => {
      const minPrice = hotel.rooms.length > 0 
        ? Math.min(...hotel.rooms.map(room => parseFloat(room.price)))
        : 0;
      
      return {
        ...hotel.toJSON(),
        minPrice
      };
    });

    if (minPrice || maxPrice) {
      const filteredHotels = hotelsWithMinPrice.filter(hotel => {
        if (minPrice && hotel.minPrice < parseFloat(minPrice)) return false;
        if (maxPrice && hotel.minPrice > parseFloat(maxPrice)) return false;
        return true;
      });
      
      return res.json({
        hotels: filteredHotels,
        totalCount: filteredHotels.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredHotels.length / limit)
      });
    }

    res.json({
      hotels: hotelsWithMinPrice,
      totalCount: hotels.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(hotels.count / limit)
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id, {
      include: [
        {
          model: Room,
          as: 'rooms',
          where: { isAvailable: true },
          required: false
        },
        {
          model: User,
          as: 'hotelier',
          attributes: ['name', 'email', 'phone']
        },
        {
          model: Review,
          as: 'reviews',
          include: [{
            model: User,
            as: 'user',
            attributes: ['name', 'avatar']
          }],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({ hotel });
  } catch (error) {
    console.error('Get hotel by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createHotel = async (req, res) => {
  try {
    const { name, description, location, address, phone, email, amenities, policies } = req.body;
    const hotelierId = req.user.id;

    const images = req.files ? req.files.map(file => file.path) : [];

    const hotel = await Hotel.create({
      name,
      description,
      location,
      address,
      phone,
      email,
      images,
      amenities: amenities ? JSON.parse(amenities) : [],
      policies: policies ? JSON.parse(policies) : {},
      hotelierId
    });

    res.status(201).json({
      message: 'Hotel created successfully',
      hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, address, phone, email, amenities, policies } = req.body;
    const hotelierId = req.user.id;

    const hotel = await Hotel.findOne({
      where: { id, hotelierId }
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }

    const updateData = {
      name,
      description,
      location,
      address,
      phone,
      email
    };

    if (amenities) {
      updateData.amenities = JSON.parse(amenities);
    }

    if (policies) {
      updateData.policies = JSON.parse(policies);
    }

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    await Hotel.update(updateData, { where: { id } });

    const updatedHotel = await Hotel.findByPk(id, {
      include: [
        {
          model: Room,
          as: 'rooms'
        }
      ]
    });

    res.json({
      message: 'Hotel updated successfully',
      hotel: updatedHotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelierId = req.user.id;

    const hotel = await Hotel.findOne({
      where: { id, hotelierId }
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }

    await Hotel.update(
      { status: 'inactive' },
      { where: { id } }
    );

    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getHotelerHotels = async (req, res) => {
  try {
    const hotelierId = req.user.id;

    const hotels = await Hotel.findAll({
      where: { hotelierId },
      include: [
        {
          model: Room,
          as: 'rooms'
        },
        {
          model: Booking,
          as: 'bookings',
          where: { status: { [Op.ne]: 'cancelled' } },
          required: false
        }
      ]
    });

    res.json({ hotels });
  } catch (error) {
    console.error('Get hoteler hotels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getHotelerProfile = async (req, res) => {
  try {
    const hotelierId = req.user.id;

    const hotelier = await User.findByPk(hotelierId, {
      attributes: ['id', 'name', 'email', 'phone', 'avatar', 'status'],
      include: [
        {
          model: Hotel,
          as: 'hotels',
          include: [
            {
              model: Room,
              as: 'rooms'
            }
          ]
        }
      ]
    });

    if (!hotelier) {
      return res.status(404).json({ message: 'Hotelier not found' });
    }

    res.json({ profile: hotelier });
  } catch (error) {
    console.error('Get hotelier profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateHotelerProfile = async (req, res) => {
  try {
    const hotelierId = req.user.id;
    const { name, email, phone } = req.body;

    const hotelier = await User.findByPk(hotelierId);

    if (!hotelier) {
      return res.status(404).json({ message: 'Hotelier not found' });
    }

    const updateData = {
      name,
      email,
      phone
    };

    if (req.file) {
      updateData.avatar = req.file.path;
    }

    await hotelier.update(updateData);

    const updatedProfile = await User.findByPk(hotelierId, {
      attributes: ['id', 'name', 'email', 'phone', 'avatar', 'status']
    });

    res.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('Update hotelier profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelerHotels,
  getHotelerProfile,
  updateHotelerProfile
};