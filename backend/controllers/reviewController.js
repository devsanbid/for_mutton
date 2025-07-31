const { Review, User, Hotel, Booking } = require('../models');
const { Op } = require('sequelize');

const createReview = async (req, res) => {
  try {
    const { rating, comment, hotelId, bookingId } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        userId,
        hotelId,
        status: 'completed'
      }
    });

    if (!booking) {
      return res.status(400).json({ 
        message: 'You can only review hotels after completing your stay' 
      });
    }

    const existingReview = await Review.findOne({
      where: { userId, hotelId, bookingId }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    const review = await Review.create({
      rating,
      comment,
      userId,
      hotelId,
      bookingId
    });

    await updateHotelRating(hotelId);

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'avatar']
        }
      ]
    });

    res.status(201).json({
      message: 'Review created successfully',
      review: reviewWithUser
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateHotelRating = async (hotelId) => {
  try {
    const reviews = await Review.findAll({
      where: { hotelId },
      attributes: ['rating']
    });

    if (reviews.length === 0) {
      await Hotel.update(
        { rating: 0, totalReviews: 0 },
        { where: { id: hotelId } }
      );
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    await Hotel.update(
      {
        rating: parseFloat(averageRating),
        totalReviews: reviews.length
      },
      { where: { id: hotelId } }
    );
  } catch (error) {
    console.error('Update hotel rating error:', error);
  }
};

const getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { hotelId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      reviews: reviews.rows,
      totalCount: reviews.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(reviews.count / limit)
    });
  } catch (error) {
    console.error('Get hotel reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'location', 'images']
        },
        {
          model: Booking,
          as: 'booking',
          attributes: ['checkIn', 'checkOut', 'bookingId']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getHotelerReviews = async (req, res) => {
  try {
    const hotelierId = req.user.id;

    const reviews = await Review.findAll({
      include: [
        {
          model: Hotel,
          as: 'hotel',
          where: { hotelierId },
          attributes: ['name', 'location']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'avatar']
        },
        {
          model: Booking,
          as: 'booking',
          attributes: ['checkIn', 'checkOut', 'bookingId']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get hoteler reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { id, userId }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    await Review.update(
      { rating, comment },
      { where: { id } }
    );

    await updateHotelRating(review.hotelId);

    const updatedReview = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'avatar']
        },
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name']
        }
      ]
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { id, userId }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    const hotelId = review.hotelId;
    await Review.destroy({ where: { id } });
    await updateHotelRating(hotelId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'avatar']
        },
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'location']
        },
        {
          model: Booking,
          as: 'booking',
          attributes: ['checkIn', 'checkOut', 'bookingId']
        }
      ]
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ review });
  } catch (error) {
    console.error('Get review by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReview,
  getHotelReviews,
  getUserReviews,
  getHotelerReviews,
  updateReview,
  deleteReview,
  getReviewById
};