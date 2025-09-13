# Frontend Integration Guide for Socket.IO Notifications

This guide explains how to integrate Socket.IO notifications into your frontend application.

## Installation

First, install the Socket.IO client library in your frontend project:

```bash
# For npm
npm install socket.io-client

# For yarn
yarn add socket.io-client

# For bun
bun add socket.io-client
```

## Basic Setup

1. **Import Socket.IO Client**:
```javascript
import { io } from 'socket.io-client';
```

2. **Initialize the Connection**:
```javascript
// Initialize the connection when your app starts
const socket = io('http://localhost:7500'); // Adjust the URL to match your backend

// Join a room when the user is authenticated
socket.emit('join', userId); // userId should be the authenticated user's ID
```

3. **Listen for Notifications**:
```javascript
// Listen for incoming notifications
socket.on('notification', (data) => {
  console.log('New notification:', data);
  // Update your UI with the notification
  // For example, show a toast message or update a notifications counter
});
```

## Complete Example

Here's a complete example of how to integrate notifications in a React component:

```javascript
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const NotificationsComponent = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:7500');
    setSocket(newSocket);

    // Join user room
    if (userId) {
      newSocket.emit('join', userId);
    }

    // Listen for notifications
    newSocket.on('notification', (data) => {
      console.log('Received notification:', data);
      setNotifications(prev => [data, ...prev]);
      
      // You can also show a toast notification here
      // toast.info(data.message);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [userId]);

  const markAsRead = (notificationId) => {
    // Call your API to mark notification as read
    fetch(`/api/v1/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Update UI to mark as read
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? {...notification, read: true} 
              : notification
          )
        );
      }
    })
    .catch(error => {
      console.error('Error marking notification as read:', error);
    });
  };

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} style={{ opacity: notification.read ? 0.6 : 1 }}>
            <strong>{notification.message}</strong>
            <p>{new Date(notification.timestamp).toLocaleString()}</p>
            {!notification.read && (
              <button onClick={() => markAsRead(notification.id)}>
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsComponent;
```

## API Integration

To fetch historical notifications, use the RESTful API:

### Get User Notifications
```javascript
const fetchNotifications = async () => {
  try {
    const response = await fetch('/api/v1/notifications', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      setNotifications(data.data);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};
```

## Notification Types

Your frontend should handle different notification types:

```javascript
socket.on('notification', (data) => {
  switch (data.type) {
    case 'NEW_LIKE':
      // Handle new like notification
      console.log(`Your car was liked by user ${data.likerId}`);
      break;
    case 'NEW_REVIEW':
      // Handle new review notification
      console.log(`Your car received a ${data.rating} star review`);
      break;
    case 'CAR_APPROVED':
      // Handle car approved notification
      console.log(`Your car "${data.carTitle}" was approved`);
      break;
    case 'CAR_REJECTED':
      // Handle car rejected notification
      console.log(`Your car was rejected: ${data.reason}`);
      break;
    default:
      // Handle general notification
      console.log(data.message);
  }
});
```

## Best Practices

1. **Connection Management**: Always close the socket connection when the component unmounts
2. **Error Handling**: Implement error handling for both socket connections and API calls
3. **User Authentication**: Ensure notifications are only sent to the correct users
4. **Performance**: Only keep necessary notifications in state to avoid memory issues
5. **User Experience**: Consider showing notifications in a toast or banner for better UX

## Troubleshooting

1. **Connection Issues**: Make sure the backend server is running and the URL is correct
2. **No Notifications**: Verify that the user is joining the correct room with their user ID
3. **CORS Issues**: Ensure CORS is properly configured in the backend to allow your frontend origin