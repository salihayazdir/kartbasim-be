import { Request, Response } from 'express';
import logger from '../utils/logger';
import { ErrorDetails, ResponseObject } from '../data/models';
import {
	createSessionService,
	loginService,
	logoutService,
	refreshSessionService,
} from '../services/auth.service';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt';
import config from 'config';

const { accessTokenValidTime, refreshTokenValidTime } = config.get<{
	accessTokenValidTime: number;
	refreshTokenValidTime: number;
	otpValidTime: number;
}>('auth.parameters');

export async function loginController(req: Request, res: Response) {
	try {
		const { username } = req.body;
		const serviceResult = await loginService(username);

		const responseObject: ResponseObject<string> = {
			error: false,
			data: serviceResult,
		};

		return res.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		const responseObject: ResponseObject<null> = {
			error: err,
			data: null,
		};
		return res.status(400).send(responseObject);
	}
}

export async function createSessionController(req: Request, res: Response) {
	try {
		const { username, otp } = req.body;
		const serviceResult = await createSessionService(username, otp);
		const responseObject: ResponseObject<{ accessToken: string; refreshToken: string }> = {
			error: false,
			data: {
				...serviceResult,
			},
		};

		return res
			.cookie('Authorization', `Bearer ${serviceResult.accessToken}`, {
				secure: false,
				// httpOnly: true,
				maxAge: 1000 * 60 * accessTokenValidTime,
			})
			.cookie('refresh', `${serviceResult.refreshToken}`, {
				secure: false,
				// httpOnly: true,
				maxAge: 1000 * 60 * refreshTokenValidTime,
			})
			.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		const responseObject: ResponseObject<null> = {
			error: err,
			data: null,
		};
		return res.status(400).send(responseObject);
	}
}

export async function refreshSessionController(req: Request, res: Response) {
	try {
		const refreshToken = res.locals.refreshToken;
		if (!refreshToken) {
			const errorDetails: ErrorDetails = {
				code: 'TOKEN',
				message: 'Refresh token bulunamadı.',
			};
			throw errorDetails;
		}
		const decodedRefreshToken = verifyJwt<{
			sessionId: number;
			iat: number;
		}>(refreshToken, 'refreshTokenPublicKey');

		if (!decodedRefreshToken) {
			const errorDetails: ErrorDetails = {
				code: 'TOKEN',
				message: 'Refresh token doğrulanamadı.',
			};
			throw errorDetails;
		}

		const serviceResult = await refreshSessionService(decodedRefreshToken);

		const responseObject: ResponseObject<{ accessToken: string }> = {
			error: false,
			data: { accessToken: serviceResult },
		};

		return res
			.cookie('Authorization', `Bearer ${serviceResult}`, {
				secure: false,
				// httpOnly: true,
				maxAge: 1000 * 60 * accessTokenValidTime,
			})
			.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		const responseObject: ResponseObject<null> = {
			error: err,
			data: null,
		};
		return res.status(400).send(responseObject);
	}
}

export async function logoutController(req: Request, res: Response) {
	try {
		const { username } = res.locals.user;
		if (username) logoutService(username);

		const responseObject: ResponseObject<string> = {
			error: false,
			data: 'Logout başarılı.',
		};

		return res.clearCookie('Authorization').clearCookie('refresh').send(responseObject);
	} catch (err: any) {
		logger.error(err);
		const responseObject: ResponseObject<null> = {
			error: err,
			data: null,
		};
		return res.status(400).send(responseObject);
	}
}
