import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import logger from '../utils/logger';
import { ResponseObject, ErrorDetails } from '../data/models';

const validateResource =
	(schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (err: any) {
			logger.error(err);
			const responseObject: ResponseObject<null> = {
				error: {
					code: 'REQUEST_VALIDATION',
					message: err.errors[0].message,
				},
				data: null,
			};
			return res.status(400).send(responseObject);
		}
	};

export default validateResource;