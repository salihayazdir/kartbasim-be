import { Request, Response, NextFunction } from 'express';
import { ErrorDetails, ResponseObject } from '../data/models';
export default async function requireUser(req: Request, res: Response, next: NextFunction) {
	const user = res.locals.user;
	if (!user) {
		const errorDetails: ErrorDetails = {
			code: 'ACCESS_TOKEN',
			message: 'Access Token doğrulanamadı.',
		};
		const responseObject: ResponseObject<null> = {
			error: errorDetails,
			data: null,
		};
		return res.status(401).send(responseObject);
	}

	return next();
}
