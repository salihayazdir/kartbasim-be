import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import {
	addBankService,
	getBankService,
	getBanksService,
	editBankService,
	deleteBankService,
} from '../service/bank.service';
import { GetBanksInput, GetBankInput, AddBankInput, EditBankInput } from '../schema/bank.schema';
import { Bank } from '../database/models';

export async function getBanksController(req: Request<GetBanksInput['body']>, res: Response) {
	try {
		const banksRecordset = await getBanksService();
		const responseObject = {
			success: true,
			recordset: banksRecordset,
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
		const responseObject = {
			success: true,
			recordset: serviceResult,
		};
		return res.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		return res.status(400).send(err.message);
	}
}

export async function addBankController(req: Request<AddBankInput['body']>, res: Response) {
	try {
		const { bankName } = req.body;
		const serviceResult = await addBankService(bankName);
		const responseObject = {
			success: true,
			recordset: serviceResult,
		};
		return res.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		return res.status(400).send(err.message);
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
			bank_id: numberBankId,
			bank_name: bankName,
			is_active: isActive,
		};

		const serviceResult = await editBankService(bankToEdit);

		const responseObject = {
			success: true,
			recordset: serviceResult,
		};

		return res.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		return res.status(400).send(err.message);
	}
}

export async function deleteBankController(req: Request<GetBankInput['params']>, res: Response) {
	try {
		const bankIdFromRequest: string = req.params.bankId;
		const bankIdNumberFromRequest: number = parseInt(bankIdFromRequest);
		const serviceResult = await deleteBankService(bankIdNumberFromRequest);
		const responseObject = {
			success: true,
			recordset: serviceResult,
		};
		return res.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		return res.status(400).send(err.message);
	}
}
