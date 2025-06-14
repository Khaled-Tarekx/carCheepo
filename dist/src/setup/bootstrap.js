import express from 'express';
import ErrorHandler from '../errors/middleware.js';
import UserRouter from '../modules/users/routes.js';
import AuthRouter from '../modules/auth/routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import cors from 'cors';
const bootstrap = (app) => {
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    }));
    app.use('/api/v1', AuthRouter);
    app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/uploads', express.static('uploads'));
    app.use('/api/v1/users', UserRouter);
    app.use(ErrorHandler);
};
export default bootstrap;
