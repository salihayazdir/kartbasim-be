import logger from '../utils/logger';
import { Printer, ErrorDetails } from '../data/models';
import utcOffset from '../utils/utcOffset';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';

const dbConfig = config.get<string>('dev.db');

export async function getPrintersService() {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Printer> = await (await pool)
			.request()
			.execute('dbo.PRINTERS_GET_PRINTERS');
		logger.info(result);

		const { recordset } = result;
		const recordsetDatesAdjusted: Printer[] = recordset.map((record) => ({
			...record,
			created_at: record.created_at ? utcOffset(record.created_at) : record.created_at,
			edited_at: record.edited_at ? utcOffset(record.edited_at) : record.edited_at,
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

export async function getPrinterService(id: number) {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Printer> = await (await pool)
			.request()
			.input('id', sql.Int, id)
			.execute('dbo.PRINTERS_GET_PRINTER');
		logger.info(result);

		const { recordset } = result;
		if (recordset.length !== 1) {
			const errorDetails: ErrorDetails = {
				code: 'NOT_FOUND',
				message: 'Printer bulunamadı.',
			};
			throw errorDetails;
		}

		const recordsetDatesAdjusted: Printer[] = recordset.map((record) => ({
			...record,
			created_at: record.created_at ? utcOffset(record.created_at) : record.created_at,
			edited_at: record.edited_at ? utcOffset(record.edited_at) : record.edited_at,
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

export async function addPrinterService(
	printer: Omit<Printer, 'id' | 'is_deleted'>
): Promise<number> {
	try {
		const { name, serial_no, model, description } = printer;

		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Printer> = await (await pool)
			.request()
			.input('name', sql.NVarChar, name)
			.input('serial_no', sql.NVarChar, serial_no)
			.input('model', sql.NVarChar, model)
			.input('description', sql.NVarChar, description)
			.execute('dbo.PRINTERS_ADD_PRINTER');
		logger.info(result);

		return result.returnValue;
	} catch (err: any) {
		logger.error(err);
		if (err.message.indexOf('unique index') !== -1) {
			const errorDetails: ErrorDetails = {
				code: 'UNIQUE_INDEX',
				message: 'Makine seri numarası ve ismi benzersiz olmalıdır.',
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

export async function editPrinterService(printer: Printer) {
	try {
		const { id, name, serial_no, model, description, is_active } = printer;

		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Printer> = await (await pool)
			.request()
			.input('id', sql.Int, id)
			.input('name', sql.NVarChar, name)
			.input('is_active', sql.Bit, is_active)
			.input('serial_no', sql.NVarChar, serial_no)
			.input('model', sql.NVarChar, model)
			.input('description', sql.NVarChar, description)
			.execute('dbo.PRINTERS_EDIT_PRINTER');

		logger.info(result);

		const { returnValue } = result;
		if (returnValue === -1) {
			const errorDetails: ErrorDetails = {
				code: 'NOT_FOUND',
				message: 'Makine bulunamadı.',
			};
			throw errorDetails;
		}

		return returnValue;
	} catch (err: any) {
		if (err.message.indexOf('unique index') !== -1) {
			const errorDetails: ErrorDetails = {
				code: 'UNIQUE_INDEX',
				message: 'Makine seri numarası ve ismi benzersiz olmalıdır.',
			};
			throw errorDetails;
		}
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabanı bağlantı hatası.',
		};
		throw errorDetails;
	}
}

export async function deletePrinterService(id: number) {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Printer> = await (await pool)
			.request()
			.input('id', id)
			.execute('dbo.PRINTERS_DELETE_PRINTER');
		logger.info(result);

		const { returnValue } = result;
		if (returnValue === -1) {
			const errorDetails: ErrorDetails = {
				code: 'NOT_FOUND',
				message: 'Makine bulunamadı.',
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
