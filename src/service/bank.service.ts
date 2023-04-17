import { Request } from 'express';
import logger from '../utils/logger';
import { Bank } from '../database/models';
import {
	getBanksProc,
	getBankProc,
	editBankProc,
	addBankProc,
	deleteBankProc,
} from '../database/storedProcs';

export async function getBanksService() {
	try {
		const dbResponse = await getBanksProc();
		return dbResponse.recordset;
	} catch (err) {
		logger.error(err);
		return err;
	}
}

export async function getBankService(bankId: number) {
	try {
		const dbResponse = await getBankProc(bankId);
		const { recordset } = dbResponse;
		return recordset;
	} catch (err) {
		logger.error(err);
		return err;
	}
}

export async function addBankService(bankName: string) {
	try {
		const dbResponse = await addBankProc(bankName);
		const { recordset } = dbResponse;
		return recordset;
	} catch (err) {
		logger.error(err);
		return err;
	}
}

export async function editBankService(bankProps: Bank) {
	try {
		const dbResponse = await editBankProc(bankProps);
		const { recordset } = dbResponse;
		return recordset;
	} catch (err) {
		logger.error(err);
		return err;
	}
}

export async function deleteBankService(bankId: number) {
	try {
		const dbResponse = await deleteBankProc(bankId);
		const { recordset } = dbResponse;
		return recordset;
	} catch (err) {
		logger.error(err);
		return err;
	}
}
