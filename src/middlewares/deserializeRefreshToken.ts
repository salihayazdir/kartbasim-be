import { Request, Response, NextFunction } from 'express';
var cookie = require('cookie');

export default async function deserializeRefreshToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	let refreshToken: string = '';

	console.log(req.baseUrl);

	if (req.headers.refresh) refreshToken = (req.headers.refresh as string) || '';
	if (req.headers.cookie) refreshToken = cookie.parse(req.headers.cookie)?.refresh || '';

	if (refreshToken === '') return next();

	res.locals.refreshToken = refreshToken;
	return next();
}
