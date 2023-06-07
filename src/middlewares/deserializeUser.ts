import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
var cookie = require('cookie');

export default async function deserializeUser(req: Request, res: Response, next: NextFunction) {
	let accessToken: string = '';

	if (req.headers.authorization)
		accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');
	if (req.headers.cookie)
		accessToken = (cookie.parse(req.headers.cookie).Authorization || '').replace(/^Bearer\s/, '');

	if (accessToken === '') return next();

	const decoded = verifyJwt(accessToken, 'accessTokenPublicKey');

	if (!decoded) {
		return next();
	}

	if (decoded) res.locals.user = decoded;
	return next();
}
