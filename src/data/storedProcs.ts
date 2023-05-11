import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';
import logger from '../utils/logger';
import { Bank, ErrorDetails } from './models';

const dbConfig = config.get<string>('dev.db');

export async function getBanksProc(): Promise<IProcedureResult<Bank>> {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Bank> = await (await pool)
			.request()
			.execute('dbo.banks_get_banks');
		logger.info(result);
		return result;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function getBankProc(bankId: number): Promise<IProcedureResult<Bank>> {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Bank> = await (await pool)
			.request()
			.input('bank_id', sql.Int, bankId)
			.execute('dbo.banks_get_bank');
		logger.info(result);
		return result;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function getBankByNameProc(bankName: string): Promise<IProcedureResult<Bank>> {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Bank> = await (await pool)
			.request()
			.input('bank_name', sql.NVarChar, bankName)
			.execute('dbo.banks_get_bank_by_name');
		logger.info(result);
		return result;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function addBankProc(bankName: string): Promise<IProcedureResult<Bank>> {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Bank> = await (await pool)
			.request()
			.input('bank_name', sql.NVarChar, bankName)
			.execute('dbo.banks_add_bank');
		logger.info(result);
		return result;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function editBankProc(bankProps: Bank): Promise<IProcedureResult<Bank>> {
	try {
		const { id, name, is_active } = bankProps;

		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Bank> = await (await pool)
			.request()
			.input('bank_id', sql.Int, id)
			.input('bank_name', sql.NVarChar, name)
			.input('is_active', sql.Bit, is_active)
			.execute('dbo.banks_edit_bank');

		logger.info(result);
		return result;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function deleteBankProc(bankId: number): Promise<IProcedureResult<Bank>> {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Bank> = await (await pool)
			.request()
			.input('bank_id', bankId)
			.execute('dbo.banks_delete_bank');
		logger.info(result);
		return result;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}
