import express, { Application } from 'express';
import ErrorHandler from '../errors/middleware';
import UserRouter from '../modules/users/routes';
import AuthRouter from '../modules/auth/routes';
import TaskRouter from '../modules/tasks/routes';
import CommentRouter from '../modules/comments/routes';
import LikeRouter from '../modules/likes/routes';
import InvitationRouter from '../modules/invite_link/routes';
import WorkSpaceRouter from '../modules/workspaces/routes';
import MembersRouter from '../modules/workspaces/members/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../setup/swagger';
import cors from 'cors';
import { getTasksPage } from '../modules/tasks/controllers';
import { authMiddleware } from '../modules/auth/middleware';

const bootstrap = (app: Application) => {
	app.use(express.json());
	app.use(cors());

	app.use('/api/v1', AuthRouter);
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	app.get('/tasks', getTasksPage);
	app.set('view engine', 'ejs');

	app.use('/uploads', express.static('uploads'));

	app.use('/api/v1/users', UserRouter);
	app.use('/api/v1/invitation', InvitationRouter);
	app.use('/api/v1/workspaces', WorkSpaceRouter);
	app.use('/api/v1/workspaces', MembersRouter);
	app.use('/api/v1/tasks', TaskRouter);
	app.use('/api/v1/comments', CommentRouter);
	app.use('/api/v1/likes', LikeRouter);
	app.use(ErrorHandler);
};

export default bootstrap;
