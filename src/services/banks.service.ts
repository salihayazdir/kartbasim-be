import logger from '../utils/logger';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';
import { Bank, ErrorDetails } from '../data/models';
import utcOffset from '../utils/utcOffset';

const dbConfig = config.get<string>('dev.db');

export async function getBanksService() {
	try {
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
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function getBankService(id: number) {
	try {
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
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function addBankService(name: string): Promise<number> {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Bank> = await (await pool)
			.request()
			.input('name', sql.NVarChar, name)
			.execute('dbo.BANKS_ADD_BANK');
		logger.info(result);
		const { returnValue } = result;

		return returnValue;
	} catch (err: any) {
		logger.error(err);
		if (err.message.indexOf('unique index') !== -1) {
			const errorDetails: ErrorDetails = {
				code: 'UNIQUE_INDEX',
				message: 'Banka ismi benzersiz olmalıdır.',
			};
			throw errorDetails;
		}
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function editBankService(bankProps: Bank) {
	try {
		const { id, name, is_active } = bankProps;

		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Bank> = await (await pool)
			.request()
			.input('id', sql.Int, id)
			.input('name', sql.NVarChar, name)
			.input('is_active', sql.Bit, is_active)
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
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function deleteBankService(id: number) {
	try {
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
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}
