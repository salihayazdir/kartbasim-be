import logger from '../utils/logger';
import { ErrorDetails, Consumable } from '../data/models';
import utcOffset from '../utils/utcOffset';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';

const dbConfig = config.get<string>('db');

export async function getConsumablesService() {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Consumable> = await (await pool)
		.request()
		.execute('dbo.CONSUMABLES_GET_CONSUMABLES');
	logger.info(result);

	const { recordset } = result;

	if (!recordset) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuatler bulunamadi.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: Consumable[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));
	return recordsetDatesAdjusted;
}

export async function getConsumableService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Consumable> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.execute('dbo.CONSUMABLES_GET_CONSUMABLE');
	logger.info(result);

	const { recordset } = result;

	if (recordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuat bulunamadı.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: Consumable[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));

	return recordsetDatesAdjusted;
}

export async function addConsumableService(
	consumable: Omit<Consumable, 'id' | 'stock_quantity' | 'is_deleted'>,
	username: string
): Promise<number> {
	const { name, consumable_type_id } = consumable;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Consumable> = await (await pool)
		.request()
		.input('name', sql.NVarChar, name)
		.input('consumable_type_id', sql.Int, consumable_type_id)
		.input('created_by', sql.NVarChar, username)
		.execute('dbo.CONSUMABLES_ADD_CONSUMABLE');
	logger.info(result);

	const { returnValue } = result;
	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuat eklenemedi.',
		};
		throw errorDetails;
	}

	return result.returnValue;
}

export async function editConsumableService(
	consumable: Omit<Consumable, 'stock_quantity'>,
	username: string
) {
	const { id, name, consumable_type_id, is_active } = consumable;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Consumable> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.input('name', sql.NVarChar, name)
		.input('is_active', sql.Bit, is_active)
		.input('consumable_type_id', sql.Int, consumable_type_id)
		.input('edited_by', sql.NVarChar, username)
		.execute('dbo.CONSUMABLES_EDIT_CONSUMABLE');
	logger.info(result);

	const { returnValue } = result;
	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuat bulunamadı.',
		};
		throw errorDetails;
	}
	return returnValue;
}

export async function deleteConsumableService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Consumable> = await (await pool)
		.request()
		.input('id', id)
		.execute('dbo.CONSUMABLES_DELETE_CONSUMABLE');
	logger.info(result);

	const { returnValue } = result;

	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuat silinemedi.',
		};
		throw errorDetails;
	}
	return returnValue;
}
