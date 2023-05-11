import { Request, Response, NextFunction } from 'express';
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
import { IRecordSet } from 'mssql';

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
		const bankIdFromRequest: string = req.params.bankId;
		const bankIdNumberFromRequest: number = parseInt(bankIdFromRequest);
		const serviceResult = await getBankService(bankIdNumberFromRequest);
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
		const { bankName } = req.body;
		const serviceResult = await addBankService(bankName);
		const responseObject: ResponseObject<{ insertedBankId: number }> = {
			error: false,
			data: {
				insertedBankId: serviceResult,
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
		const { bankName, isActive } = req.body;
		const { bankId } = req.params;
		const numberBankId = parseInt(bankId);

		const bankToEdit: Bank = {
			id: numberBankId,
			name: bankName,
			is_active: isActive,
			is_deleted: false,
		};

		const serviceResult = await editBankService(bankToEdit);

		const responseObject: ResponseObject<{ editedBankId: number }> = {
			error: false,
			data: {
				editedBankId: serviceResult,
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
		const bankIdFromRequest: string = req.params.bankId;
		const bankIdNumberFromRequest: number = parseInt(bankIdFromRequest);

		const serviceResult = await deleteBankService(bankIdNumberFromRequest);
		const responseObject: ResponseObject<{ deletedBankId: number }> = {
			error: false,
			data: {
				deletedBankId: serviceResult,
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
