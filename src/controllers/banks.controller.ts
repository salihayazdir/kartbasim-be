import { Request, Response } from 'express';
import logger from '../utils/logger';
import {
	addBankService,
	getBankService,
	getBanksService,
	editBankService,
	deleteBankService,
} from '../services/banks.service';
import {
	GetBanksInput,
	GetBankInput,
	AddBankInput,
	EditBankInput,
	DeleteBankInput,
} from '../schemas/banks.schema';
import { Bank, ResponseObject } from '../data/models';

export async function getBanksController(req: Request<GetBanksInput['body']>, res: Response) {
	try {
		const banksRecordset = await getBanksService();
		const responseObject: ResponseObject<Bank[]> = {
			error: false,
			data: banksRecordset,
		};
		return res.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		return res.status(400).send(err.message);
	}
}

export async function getBankController(req: Request<GetBankInput['params']>, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);
		const serviceResult = await getBankService(idNumberFromRequest);
		const responseObject: ResponseObject<Bank[]> = {
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

export async function addBankController(req: Request<AddBankInput['body']>, res: Response) {
	try {
		const { name } = req.body;
		const serviceResult = await addBankService(name);
		const responseObject: ResponseObject<{ insertedId: number }> = {
			error: false,
			data: {
				insertedId: serviceResult,
			},
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

export async function editBankController(
	req: Request<EditBankInput['params'], EditBankInput['body']>,
	res: Response
) {
	try {
		const { name, is_active } = req.body;
		const { id } = req.params;
		const parsedId = parseInt(id);

		const bankToEdit: Bank = {
			id: parsedId,
			name,
			is_active,
			is_deleted: false,
		};

		const serviceResult = await editBankService(bankToEdit);

		const responseObject: ResponseObject<{ editedId: number }> = {
			error: false,
			data: {
				editedId: serviceResult,
			},
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

export async function deleteBankController(req: Request<DeleteBankInput['params']>, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);

		const serviceResult = await deleteBankService(idNumberFromRequest);
		const responseObject: ResponseObject<{ deletedId: number }> = {
			error: false,
			data: {
				deletedId: serviceResult,
			},
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
