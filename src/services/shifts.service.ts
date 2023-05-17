import logger from '../utils/logger';
import { Shift, ErrorDetails } from '../data/models';
import utcOffset from '../utils/utcOffset';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';

const dbConfig = config.get<string>('dev.db');

export async function getShiftsService() {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Shift> = await (await pool)
			.request()
			.execute('dbo.SHIFTS_GET_SHIFTS');
		logger.info(result);

		const { recordset } = result;
		const recordsetDatesAdjusted: Shift[] = recordset.map((record) => ({
			...record,
			created_at: record.created_at ? utcOffset(record.created_at) : record.created_at,
			edited_at: record.edited_at ? utcOffset(record.edited_at) : record.edited_at,
		}));
		return recordsetDatesAdjusted;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabani bağlanti hatasi.',
		};
		throw errorDetails;
	}
}

export async function getShiftService(id: number) {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Shift> = await (await pool)
			.request()
			.input('id', sql.Int, id)
			.execute('dbo.SHIFTS_GET_SHIFT');
		logger.info(result);

		const { recordset } = result;
		if (recordset.length !== 1) {
			const errorDetails: ErrorDetails = {
				code: 'NOT_FOUND',
				message: 'Vardiya bulunamadi.',
			};
			throw errorDetails;
		}

		const recordsetDatesAdjusted: Shift[] = recordset.map((record) => ({
			...record,
			created_at: record.created_at ? utcOffset(record.created_at) : record.created_at,
			edited_at: record.edited_at ? utcOffset(record.edited_at) : record.edited_at,
		}));

		return recordsetDatesAdjusted;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabani bağlanti hatasi.',
		};
		throw errorDetails;
	}
}

export async function addShiftService(
	shift: Omit<Shift, 'id' | 'is_deleted'>
): Promise<number> {
	try {
		const { description, start_hour, end_hour} = shift;

		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Shift> = await (await pool)
			.request()
			.input('description', sql.NVarChar, description)
			.input('start_hour', sql.Int, start_hour)
			.input('end_hour', sql.Int, end_hour)
			.execute('dbo.SHIFTS_ADD_SHIFT');
		logger.info(result);

		return result.returnValue;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabani baglanti hatasi.',
		};
		throw errorDetails;
	}
}

export async function editShiftService(shift: Shift) {
	try {
		const { id, description, start_hour, end_hour, is_active } = shift;

		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Shift> = await (await pool)
			.request()
			.input('id', sql.Int, id)
			.input('description', sql.NVarChar, description)
            .input('start_hour', sql.Int, start_hour)
			.input('end_hour', sql.Int, end_hour)
			.input('is_active', sql.Bit, is_active)
			.execute('dbo.SHIFTS_EDIT_SHIFT');

		logger.info(result);

		const { returnValue } = result;
		if (returnValue === -1) {
			const errorDetails: ErrorDetails = {
				code: 'NOT_FOUND',
				message: 'Vardiya bulunamadi.',
			};
			throw errorDetails;
		}
		return returnValue;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabani bağlanti hatasi.',
		};
		throw errorDetails;
	}
}

export async function deleteShiftService(id: number) {
	try {
		const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
		const result: IProcedureResult<Shift> = await (await pool)
			.request()
			.input('id', id)
			.execute('dbo.SHIFTS_DELETE_SHIFT');
		logger.info(result);

		const { returnValue } = result;
		if (returnValue === -1) {
			const errorDetails: ErrorDetails = {
				code: 'NOT_FOUND',
				message: 'Vardiya bulunamadi.',
			};
			throw errorDetails;
		}

		return returnValue;
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: 'Veritabani bağlanti hatasi.',
		};
		throw errorDetails;
	}
}

