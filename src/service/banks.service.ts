import logger from '../utils/logger';
import { Bank } from '../data/models';
import {
	getBanksProc,
	getBankProc,
	getBankByNameProc,
	editBankProc,
	addBankProc,
	deleteBankProc,
} from '../data/storedProcs';
import utcOffset from '../utils/utcOffset';
import { IRecordSet } from 'mssql';

export async function getBanksService() {
	try {
		const dbResponse = await getBanksProc();
		const { recordset } = dbResponse;
		const recordsetDatesAdjusted: Bank[] = recordset.map((record) => ({
			...record,
			created_at: record.created_at ? utcOffset(record.created_at) : record.created_at,
			edited_at: record.edited_at ? utcOffset(record.edited_at) : record.edited_at,
		}));
		return recordsetDatesAdjusted;
	} catch (err) {
		logger.error(err);
		throw err;
	}
}

export async function getBankService(bankId: number) {
	try {
		const dbResponse = await getBankProc(bankId);
		const { recordset } = dbResponse;
		const recordsetDatesAdjusted: Bank[] = recordset.map((record) => ({
			...record,
			created_at: record.created_at ? utcOffset(record.created_at) : record.created_at,
			edited_at: record.edited_at ? utcOffset(record.edited_at) : record.edited_at,
		}));
		return recordsetDatesAdjusted;
	} catch (err) {
		logger.error(err);
		throw err;
	}
}

export async function addBankService(bankName: string): Promise<IRecordSet<Bank>> {
	// try {
	const checkBankExistsDbResponse = await getBankByNameProc(bankName);
	if (checkBankExistsDbResponse.recordset.length > 0)
		throw new Error('Banka ismi benzersiz olmalıdır.');

	const addBankDbResponse = await addBankProc(bankName);
	const { recordset } = addBankDbResponse;
	return recordset;

	// } catch (err) {
	// 	logger.error(err);
	// 	throw (err);
	// }
}

export async function editBankService(bankProps: Bank) {
	try {
		const dbResponse = await editBankProc(bankProps);
		const { recordset } = dbResponse;
		return recordset;
	} catch (err) {
		logger.error(err);
		throw err;
	}
}

export async function deleteBankService(bankId: number) {
	try {
		const dbResponse = await deleteBankProc(bankId);
		const { recordset } = dbResponse;
		return recordset;
	} catch (err) {
		logger.error(err);
		throw err;
	}
}
