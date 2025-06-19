import express, { Application } from 'express';
import ErrorHandler from '../errors/middleware';
import UserRouter from '../modules/users/routes';
import AuthRouter from '../modules/auth/routes';
import CarsRouter from '../modules/cars/routes';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../setup/swagger';
import cors from 'cors';

const bootstrap = (app: Application) => {
	app.use(express.json({ limit: '10mb' }));
	app.use(
		cors({
			origin: ['http://localhost:3000', 'http://localhost:5173'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization']
		})
	);

	app.use('/api/v1', AuthRouter);
	app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	app.use('/uploads', express.static('uploads'));

	app.use('/api/v1/users', UserRouter);
	app.use('/api/v1/cars', CarsRouter);
	app.use(ErrorHandler);
};

export default bootstrap;
