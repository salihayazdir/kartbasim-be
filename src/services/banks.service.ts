import logger from '../utils/logger';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';
import { Bank, ErrorDetails } from '../data/models';
import utcOffset from '../utils/utcOffset';

const dbConfig = config.get<string>('db');

export async function getBanksService() {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Bank> = await (await pool)
		.request()
		.execute('dbo.BANKS_GET_BANKS');
	logger.info(result);

	const { recordset } = result;
	const recordsetDatesAdjusted: Bank[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at)?.format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at)?.format() : record.edited_at,
	}));
	return recordsetDatesAdjusted;
}

export async function getBankService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Bank> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.execute('dbo.BANKS_GET_BANK');
	logger.info(result);

	const { recordset } = result;
	if (recordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Banka bulunamadı.',
		};
		throw errorDetails;
	}
	const recordsetDatesAdjusted: Bank[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at)?.format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at)?.format() : record.edited_at,
	}));

	return recordsetDatesAdjusted;
}

export async function addBankService(name: string, username: string): Promise<number> {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Bank> = await (await pool)
		.request()
		.input('name', sql.NVarChar, name)
		.input('created_by', sql.NVarChar, username)
		.execute('dbo.BANKS_ADD_BANK');
	logger.info(result);
	const { returnValue } = result;

	return returnValue;
}

export async function editBankService(bankProps: Bank, username: string) {
	const { id, name, is_active } = bankProps;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Bank> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.input('name', sql.NVarChar, name)
		.input('is_active', sql.Bit, is_active)
		.input('edited_by', sql.NVarChar, username)
		.execute('dbo.BANKS_EDIT_BANK');

	logger.info(result);

	const { returnValue } = result;
	if (returnValue === -1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Banka bulunamadı.',
		};
		throw errorDetails;
	}

	return returnValue;
}

export async function deleteBankService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Bank> = await (await pool)
		.request()
		.input('id', id)
		.execute('dbo.BANKS_DELETE_BANK');
	logger.info(result);

	const { returnValue } = result;
	if (returnValue === -1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Banka bulunamadı.',
		};
		throw errorDetails;
	}

	return returnValue;
}
