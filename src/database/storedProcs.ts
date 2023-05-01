import config from 'config';
import sql, { IProcedureResult, MSSQLError, ConnectionPool } from 'mssql';
import logger from '../utils/logger';
import { Bank } from './models';

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
		throw new MSSQLError(err);
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
		throw new MSSQLError(err);
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
		throw new MSSQLError(err);
	}
}

export async function editBankProc(bankProps: Bank): Promise<IProcedureResult<Bank>> {
	try {
		const { bank_id, bank_name, is_active } = bankProps;

		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Bank> = await (await pool)
			.request()
			.input('bank_id', sql.Int, bank_id)
			.input('bank_name', sql.NVarChar, bank_name)
			.input('is_active', sql.Bit, is_active)
			.execute('dbo.banks_edit_bank');

		logger.info(result);
		return result;
	} catch (err: any) {
		logger.error(err);
		throw new MSSQLError(err);
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
		throw new MSSQLError(err);
	}
}
