import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Car Resale API',
			version: '1.0.0',
			description: 'API documentation for Car Resale Application',
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
			schemas: {
				Notification: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							example: '1234567890'
						},
						type: {
							type: 'string',
							example: 'NEW_LIKE'
						},
						message: {
							type: 'string',
							example: 'Someone liked your car!'
						},
						data: {
							type: 'object',
							example: {
								carId: 'car123',
								likerId: 'user456'
							}
						},
						timestamp: {
							type: 'string',
							format: 'date-time',
							example: '2023-01-01T00:00:00.000Z'
						},
						read: {
							type: 'boolean',
							example: false
						}
					}
				},
				CarLike: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							example: 'like123'
						},
						owner: {
							type: 'string',
							example: 'user456'
						},
						car: {
							type: 'string',
							example: 'car789'
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
							example: '2023-01-01T00:00:00.000Z'
						},
						updatedAt: {
							type: 'string',
							format: 'date-time',
							example: '2023-01-01T00:00:00.000Z'
						}
					}
				}
			}
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
