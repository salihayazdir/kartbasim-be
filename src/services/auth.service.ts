import logger from '../utils/logger';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';
import { ErrorDetails, User } from '../data/models';
import sendMail from '../utils/sendMail';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { signJwt } from '../utils/jwt';
import utcOffset from '../utils/utcOffset';

const dbConfig = config.get<string>('db');
const { accessTokenValidTime, refreshTokenValidTime, otpValidTime } = config.get<{
	accessTokenValidTime: number;
	refreshTokenValidTime: number;
	otpValidTime: number;
}>('auth.parameters');

export async function loginService(username: string) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const getUserResult: IProcedureResult<User> = await (await pool)
		.request()
		.input('username', sql.NVarChar, username)
		.execute('dbo.USERS_GET_USER');
	logger.info(getUserResult);

	const { recordset } = getUserResult;

	if (recordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Kullanıcı bulunamadı.',
		};
		throw errorDetails;
	}

	const user: User = recordset[0];

	if (user.user_role_id === 1) {
		const errorDetails: ErrorDetails = {
			code: 'UNAUTHORIZED',
			message: 'Sisteme giriş yetkiniz bulunmuyor.',
		};
		throw errorDetails;
	}

	const randomNumber: number = crypto.randomInt(0, 1000000);
	const otp: string = randomNumber.toString().padStart(6, '0');

	bcrypt.hash(otp, 10, async (err, hash) => {
		if (err) {
			const errorDetails: ErrorDetails = {
				code: 'OTP',
				message: 'Doğrulama kodu oluşturulamadı.',
			};
			throw errorDetails;
		}

		await (await pool)
			.request()
			.input('otp', sql.NVarChar, hash)
			.input('username', sql.NVarChar, user.username)
			.execute('dbo.AUTH_OTP_ADD_OTP');
	});

	const mailResult = await sendMail('test', 'OTP', otp);

	if (mailResult !== true) {
		const errorDetails: ErrorDetails = {
			code: 'MAIL',
			message: 'Doğrulama kodu gönderilemedi.',
		};
		throw errorDetails;
	}

	return `Doğrulama kodu ${user.mail} adresine gönderildi.`;
}

export async function createSessionService(
	username: string,
	otp: string
): Promise<{ accessToken: string; refreshToken: string }> {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const getOtpResult: IProcedureResult<any> = await (await pool)
		.request()
		.input('username', sql.NVarChar, username)
		.execute('dbo.AUTH_OTP_GET_OTP');
	logger.info(getOtpResult);

	const { recordset: otpRecordset } = getOtpResult;

	if (otpRecordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'OTP',
			message: 'Doğrulama kodu bulunamadı.',
		};
		throw errorDetails;
	}

	const otpInDb = otpRecordset[0].code;
	const match = bcrypt.compareSync(otp, otpInDb);

	if (!match) {
		const errorDetails: ErrorDetails = {
			code: 'OTP',
			message: 'Doğrulama kodu doğrulanamadı.',
		};
		throw errorDetails;
	}

	const codeCreationDate = utcOffset(otpRecordset[0].created_at);
	const now = dayjs();
	const validUntil = codeCreationDate.add(otpValidTime, 'minutes');
	const isExpired = validUntil.isBefore(now);

	if (isExpired) {
		const errorDetails: ErrorDetails = {
			code: 'OTP',
			message: 'Doğrulama kodu geçerlilik süresini yitirdi.',
		};
		throw errorDetails;
	}

	const getUserResult: IProcedureResult<User> = await (await pool)
		.request()
		.input('username', sql.NVarChar, username)
		.execute('dbo.USERS_GET_USER');
	logger.info(getUserResult);
	const { recordset: getUserRecordset } = getUserResult;

	if (getUserRecordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Kullanıcı bulunamadı.',
		};
		throw errorDetails;
	}

	const user: User = getUserRecordset[0];

	const accessToken = signJwt(user, 'accessTokenPrivateKey', {
		expiresIn: `${accessTokenValidTime ?? 10}m`,
	});

	const addSessionResult: IProcedureResult<User> = await (await pool)
		.request()
		.input('username', sql.NVarChar, username)
		.execute('dbo.AUTH_SESSION_ADD_SESSION');
	logger.info(addSessionResult);
	const { returnValue: sessionId } = addSessionResult;

	if (sessionId < 1) {
		const errorDetails: ErrorDetails = {
			code: 'SESSION',
			message: 'Session oluşturulamadı.',
		};
		throw errorDetails;
	}

	const refreshToken = signJwt({ sessionId }, 'refreshTokenPrivateKey', {
		expiresIn: `${refreshTokenValidTime ?? 60 * 24 * 30}m`,
	});

	return { refreshToken, accessToken };
}

export async function refreshSessionService(decodedRefreshToken: {
	sessionId: number;
	iat: number;
}) {
	const { sessionId } = decodedRefreshToken;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const getSessionResult: IProcedureResult<{
		id: number;
		username: string;
		created_at: string;
		is_valid: boolean;
	}> = await (await pool)
		.request()
		.input('sessionId', sql.Int, sessionId)
		.execute('dbo.AUTH_SESSION_GET_SESSION');
	logger.info(getSessionResult);
	const { recordset: getSessionRecordset } = getSessionResult;

	if (getSessionRecordset.length !== 1 || getSessionRecordset[0].is_valid !== true) {
		const errorDetails: ErrorDetails = {
			code: 'SESSION',
			message: 'Geçerli session bulunamadı.',
		};
		throw errorDetails;
	}

	const getUserResult: IProcedureResult<User> = await (await pool)
		.request()
		.input('username', sql.NVarChar, getSessionRecordset[0].username)
		.execute('dbo.USERS_GET_USER');
	logger.info(getUserResult);

	const { recordset: getUserRecordset } = getUserResult;

	if (getUserRecordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Kullanıcı bulunamadı.',
		};
		throw errorDetails;
	}

	const user: User = getUserRecordset[0];

	const accessToken = signJwt(user, 'accessTokenPrivateKey', {
		expiresIn: `${accessTokenValidTime ?? 10}m`,
	});

	return accessToken;
}

export async function logoutService(username: string) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const endSessionResult: IProcedureResult<any> = await (await pool)
		.request()
		.input('username', sql.NVarChar, username)
		.execute('dbo.AUTH_SESSION_END_SESSION');
	logger.info(endSessionResult);
	const { returnValue } = endSessionResult;

	if (returnValue < 1) {
		const errorDetails: ErrorDetails = {
			code: 'SESSION',
			message: 'Geçerli session bulunamadı.',
		};
		logger.error(errorDetails);
	}

	return returnValue;
}
