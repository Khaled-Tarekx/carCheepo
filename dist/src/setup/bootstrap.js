import express from 'express';
import ErrorHandler from '../errors/middleware.js';
import UserRouter from '../modules/users/routes.js';
import CarRouter from '../modules/cars/routes.js';
import PostRouter from '../modules/posts/routes.js';
import ReviewRouter from '../modules/reviews/routes.js';
import LikeRouter from '../modules/likes/routes.js';
import ViewRouter from '../modules/views/routes.js';
import AuthRouter from '../modules/auth/routes.js';
import NotificationsRouter from '../modules/notifications/routes.js';
import CarLikesRouter from '../modules/car-likes/routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import cors from 'cors';
const bootstrap = (app) => {
    app.use(express.json({ limit: '10mb' }));
    app.use(cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization']
    }));
    app.use('/api/v1', AuthRouter);
    app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/uploads', express.static('uploads'));
    app.use('/api/v1/users', UserRouter);
    app.use('/api/v1/cars', CarRouter);
    app.use('/api/v1/reviews', ReviewRouter);
    app.use('/api/v1/posts', PostRouter);
    app.use('/api/v1/likes', LikeRouter);
    app.use('/api/v1/car-likes', CarLikesRouter);
    app.use('/api/v1/views', ViewRouter);
    app.use('/api/v1/notifications', NotificationsRouter);
    app.use(ErrorHandler);
};
export default bootstrap;
