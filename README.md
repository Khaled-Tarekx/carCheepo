# Car Resale Backend

This is the backend for the car resale application, built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- User authentication and management
- Car listing and management
- Reviews and ratings
- Likes functionality
- Real-time notifications with Socket.IO
- Redis for notification persistence

## Installation

To install dependencies:

```bash
bun install
```

## Running the Application

To run in development mode:

```bash
bun run dev
```

To build and run in production mode:

```bash
bun run start
```

## Real-time Notifications

This application uses Socket.IO for real-time notifications. The notifications system includes:

- Real-time updates for user interactions (likes, reviews, etc.)
- Notification persistence using Redis
- RESTful API for managing notifications

For detailed information on the notifications system, see:
- [Notifications Module Documentation](src/modules/notifications/README.md)
- [Frontend Integration Guide](src/modules/notifications/FRONTEND_INTEGRATION.md)

## API Documentation

Swagger API documentation is available at:
```
http://localhost:7500/api-docs
```

## Environment Variables

Make sure to set up the required environment variables in your `.env` file:

- `PORT`: Server port (default: 7500)
- `URI`: MongoDB connection string
- `REDIS_URL`: Redis connection string (default: redis://127.0.0.1:6379)
- `ACCESS_SECRET_KEY`: JWT access token secret
- `REFRESH_SECRET_KEY`: JWT refresh token secret
