import { Request, Response, NextFunction } from 'express';
import { ResponseObject } from '../data/models';

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
	const responseObject: ResponseObject<null> = {
		error: {
			code: 'UNKNOWN',
			message: 'Bir hata meydana geldi.',
		},
		data: null,
	};
	res.status(400).send(responseObject);
}
