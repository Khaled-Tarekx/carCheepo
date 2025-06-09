import express, { Application } from 'express';
import ErrorHandler from '../errors/middleware';
import UserRouter from '../modules/users/routes';
import AuthRouter from '../modules/auth/routes';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../setup/swagger';
import cors from 'cors';

const bootstrap = (app: Application) => {
	app.use(express.json());
	app.use(cors());

	app.use('/api/v1', AuthRouter);
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	app.use('/uploads', express.static('uploads'));

	app.use('/api/v1/users', UserRouter);
	app.use(ErrorHandler);
};

export default bootstrap;
