import logger from '../utils/logger';
import { Bank, ErrorDetails } from '../data/models';
import {
	getBanksProc,
	getBankProc,
	getBankByNameProc,
	editBankProc,
	addBankProc,
	deleteBankProc,
} from '../data/storedProcs';
import utcOffset from '../utils/utcOffset';

export async function getBanksService() {
	const dbResponse = await getBanksProc();
	const { recordset } = dbResponse;
	const recordsetDatesAdjusted: Bank[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at) : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at) : record.edited_at,
	}));
	return recordsetDatesAdjusted;
}

export async function getBankService(bankId: number) {
	const dbResponse = await getBankProc(bankId);
	const { recordset } = dbResponse;
	if (recordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Banka bulunamadı.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: Bank[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at) : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at) : record.edited_at,
	}));
	return recordsetDatesAdjusted;
}

export async function addBankService(bankName: string): Promise<number> {
	const checkBankExistsDbResponse = await getBankByNameProc(bankName);
	if (checkBankExistsDbResponse.recordset.length > 0) {
		const errorDetails: ErrorDetails = {
			code: 'UNIQUE_INDEX',
			message: 'Banka ismi benzersiz olmalıdır.',
		};
		throw errorDetails;
	}

	const addBankDbResponse = await addBankProc(bankName);
	const { returnValue } = addBankDbResponse;
	return returnValue;
}

export async function editBankService(bankProps: Bank) {
	// name alanı unique kontrolü
	const checkBankExistsDbResponse = await getBankByNameProc(bankProps.name);

	// name alanı unique kontrolünde hataya sebep olan kaynak, çağırılan kaynağın kendisi olabilir.
	const sameBankCheck: boolean =
		checkBankExistsDbResponse.recordset.length === 1 &&
		checkBankExistsDbResponse.recordset[0].id !== bankProps.id;

	if (checkBankExistsDbResponse.recordset.length > 0 && sameBankCheck) {
		const errorDetails: ErrorDetails = {
			code: 'UNIQUE_INDEX',
			message: 'Bu isimde başka bir banka bulunuyor.',
		};
		throw errorDetails;
	}

	const dbResponse = await editBankProc(bankProps);
	const { returnValue, recordset } = dbResponse;
	if (returnValue === -1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Banka bulunamadı.',
		};
		throw errorDetails;
	}
	return returnValue;
}

export async function deleteBankService(bankId: number) {
	const dbResponse = await deleteBankProc(bankId);
	const { returnValue } = dbResponse;
	if (returnValue === -1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Banka bulunamadı.',
		};
		throw errorDetails;
	}
	return returnValue;
}
