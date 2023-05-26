import { Request, Response } from 'express';
import logger from '../utils/logger';
import { testService } from '../services/auth.service';
import { SearchEntryObject } from 'ldapjs';
import { ResponseObject } from '../data/models';

// import {
// 	addBankService,
// 	getBankService,
// 	getBanksService,
// 	editBankService,
// 	deleteBankService,
// } from '../services/banks.service';
// import {
// 	GetBanksInput,
// 	GetBankInput,
// 	AddBankInput,
// 	EditBankInput,
// 	DeleteBankInput,
// } from '../schemas/banks.schema';
// import { Bank, ResponseObject } from '../data/models';

export async function test(req: Request, res: Response) {
	try {
		testService((ldapData) => {
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
