# HeavenStay Backend API

A comprehensive hotel booking platform backend built with Node.js, Express, and PostgreSQL.

## Features

- **User Management**: Registration, authentication, profile management
- **Hotel Management**: CRUD operations for hotels and rooms
- **Booking System**: Complete booking workflow with payment tracking
- **Review System**: Hotel reviews and ratings
- **Admin Panel**: User approval, hotel management, analytics
- **Notification System**: Real-time notifications for users
- **File Upload**: Image upload for avatars, hotels, and rooms
- **Role-based Access**: User, Hotelier, and Admin roles

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── controllers/          # Route handlers
├── database/            # Database configuration
├── middleware/          # Custom middleware
├── models/             # Sequelize models
├── routes/             # API routes
├── uploads/            # File upload directory
├── server.js           # Main server file
└── package.json        # Dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HeavenStay/backend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Database Setup**
   - Create a PostgreSQL database named `hotel`
   - Update database credentials in `.env` file

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   - Database credentials
   - JWT secret key
   - Server port

5. **Create Admin User**
   ```bash
   bun run create-admin
   ```
   This creates an admin account with default credentials:
    - Email: `admin@heavenstay.com`
    - Password: `admin123`
   
   **Custom admin credentials:**
   ```bash
   ADMIN_EMAIL=your-admin@email.com ADMIN_PASSWORD=secure-password bun run create-admin
   ```
   
   ⚠️ **Important**: Change the default password after first login!

6. **Start the server**
   ```bash
   bun run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels` - Create hotel (Hotelier)
- `PUT /api/hotels/:id` - Update hotel (Hotelier)
- `DELETE /api/hotels/:id` - Delete hotel (Hotelier)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/hotel/:hotelId` - Get hotel reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/hotels` - Get all hotels
- `PUT /api/admin/hotels/:id/status` - Update hotel status

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

## Database Models

- **User**: User accounts with roles (user, hotelier, admin)
- **Hotel**: Hotel information and details
- **Room**: Hotel rooms with pricing and amenities
- **Booking**: Booking records with payment tracking
- **Review**: Hotel reviews and ratings
- **Notification**: System notifications
- **Payment**: Payment records and commission tracking

## User Roles

1. **User**: Can book hotels, write reviews, manage bookings
2. **Hotelier**: Can manage hotels and rooms, view bookings
3. **Admin**: Full system access, user approval, analytics

## File Upload

- **Avatar**: User profile pictures
- **Hotel Images**: Multiple images per hotel
- **Room Images**: Multiple images per room
- **Supported Formats**: JPEG, JPG, PNG, GIF, WebP
- **Size Limit**: 5MB per file

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

## Scripts

- `bun run dev` - Start development server with nodemon
- `bun run start` - Start production server

## License

MIT License