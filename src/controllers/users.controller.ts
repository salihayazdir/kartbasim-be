import { Request, Response } from 'express';
import logger from '../utils/logger';
import { updateUsersService } from '../services/users.service';
import { SearchEntryObject } from 'ldapjs';
import { ResponseObject, User } from '../data/models';

export async function updateUsersController(req: Request, res: Response) {
	try {
		updateUsersService((ldapData) => {
			const responseObject: ResponseObject<SearchEntryObject> = {
				error: false,
				data: ldapData,
			};
			return res.send(responseObject);
		});
	} catch (err: any) {
		logger.error(err);
		return res.status(400).send(err.message);
	}
}

export async function getUserController(req: Request, res: Response) {
	try {
		const responseObject: ResponseObject<User> = {
			error: false,
			data: res.locals.user,
		};
		return res.json(responseObject);
	} catch (err: any) {
		logger.error(err);
		return res.status(400).send(err.message);
	}
}
