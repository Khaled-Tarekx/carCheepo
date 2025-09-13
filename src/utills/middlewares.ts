import { type AnyZodObject, ZodError } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from './errors/cause';

type zodSchema = {
	bodySchema?: AnyZodObject;
	querySchema?: AnyZodObject;
	paramsSchema?: AnyZodObject;
};

export const validateResource = ({
	bodySchema,
	querySchema,
	paramsSchema,
}: zodSchema) => {
	return async (
		req: Request,
		_res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			// Add debug logging
			console.log(`Validating request: ${req.method} ${req.path}`);
			console.log('Schemas provided - Body:', !!bodySchema, 'Query:', !!querySchema, 'Params:', !!paramsSchema);
			console.log('Request body:', req.body);
			console.log('Request query:', req.query);
			console.log('Request params:', req.params);
			
			if (bodySchema) {
				await bodySchema.parseAsync(req.body);
			}
			if (querySchema) {
				await querySchema.parseAsync(req.query);
			}
			if (paramsSchema) {
				await paramsSchema.parseAsync(req.params);
			}
			next();
		} catch (err: unknown) {
			if (err instanceof ZodError) {
				// Create a more descriptive error message
				let errorContext = '';
				if (bodySchema && req.body && Object.keys(req.body).length === 0) {
					errorContext = ' (Empty body provided for schema that requires body)';
				} else if (bodySchema) {
					errorContext = ' (Body validation failed)';
				} else if (querySchema) {
					errorContext = ' (Query validation failed)';
				} else if (paramsSchema) {
					errorContext = ' (Params validation failed)';
				}
				
				const errorMessages = err.issues.map((issue) => [
					issue.path,
					issue.message,
				]);
				return next(new ValidationError(errorMessages.join(', ') + errorContext));
			} else {
				return next(err);
			}
		}
	};
};
