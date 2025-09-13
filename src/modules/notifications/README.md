# Notifications Module

This module implements real-time notifications using Socket.IO for the car resale application.

## Features

- Real-time notifications using Socket.IO
- Notification persistence using Redis
- RESTful API endpoints for managing notifications
- Integration with existing modules (cars, likes, reviews)

## Installation

The notifications module is already integrated with the main application. Socket.IO dependencies were installed using:

```bash
bun add socket.io socket.io-client
```

## Architecture

The notifications module consists of:

1. **Socket Server** (`socket.ts`): Initializes Socket.IO and handles real-time connections
2. **Controllers** (`controllers.ts`): Handle RESTful API requests for notifications
3. **Services** (`services.ts`): Business logic for sending different types of notifications
4. **Routes** (`routes.ts`): API endpoints for notifications
5. **Types** (`types.ts`): TypeScript interfaces and types

## How it works

1. **Socket.IO Server**: The server is initialized in `main.ts` and listens for connections
2. **Client Connections**: Clients connect to the Socket.IO server and join rooms based on their user ID
3. **Sending Notifications**: When events occur (like a new car like), the system sends real-time notifications to the relevant user
4. **Offline Notifications**: Notifications are also stored in Redis for users who are offline

## API Endpoints

### Get User Notifications
```
GET /api/v1/notifications
```

### Mark Notification as Read
```
PATCH /api/v1/notifications/:notificationId/read
```

## Notification Types

- `NEW_LIKE`: Sent when someone likes a user's car
- `NEW_REVIEW`: Sent when someone reviews a user's car
- `CAR_APPROVED`: Sent when a user's car is approved
- `CAR_REJECTED`: Sent when a user's car is rejected
- `GENERAL`: General notifications

## Integration with Other Modules

The notifications module is integrated with:
- **Car Likes**: Sends notifications when a car is liked
- **Reviews**: Sends notifications when a car receives a review
- **Car Management**: Sends notifications when a car is approved/rejected

To integrate with other modules, import the notification services and call the appropriate functions.