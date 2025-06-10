import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Task Management API',
			version: '1.0.0',
			description: 'API documentation for Task Management System',
		},
		servers: [
			{
				url: 'http://localhost:7500/api/v1',
				description: 'Development server',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: [
		path.join(__dirname, '../modules/**/*.ts'),
		path.join(__dirname, '../modules/**/*.js'),
	],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
