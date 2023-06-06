import logger from '../utils/logger';
import { ErrorDetails, ConsumableType } from '../data/models';
import utcOffset from '../utils/utcOffset';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';

const dbConfig = config.get<string>('dev.db');

export async function getConsumableTypesService() {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ConsumableType> = await (await pool)
		.request()
		.execute('dbo.CONSUMABLE_TYPES_GET_CONSUMABLE_TYPES');
	logger.info(result);

	const { recordset } = result;

	if (!recordset) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuat türleri bulunamadi.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: ConsumableType[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));
	return recordsetDatesAdjusted;
}

export async function getConsumableTypeService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ConsumableType> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.execute('dbo.CONSUMABLE_TYPES_GET_CONSUMABLE_TYPE');
	logger.info(result);

	const { recordset } = result;

	if (recordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuat tipi bulunamadı.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: ConsumableType[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));

	return recordsetDatesAdjusted;
}

export async function addConsumableTypeService(
	ConsumableType: Omit<ConsumableType, 'id' | 'is_deleted'>
): Promise<number> {
	const { name } = ConsumableType;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ConsumableType> = await (await pool)
		.request()
		.input('name', sql.NVarChar, name)
		.execute('dbo.CONSUMABLE_TYPES_ADD_CONSUMABLE_TYPE');
	logger.info(result);

	const { returnValue } = result;
	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuat tipi eklenemedi.',
		};
		throw errorDetails;
	}

	return result.returnValue;
}

export async function editConsumableTypeService(ConsumableType: ConsumableType) {
	const { id, name, is_active } = ConsumableType;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ConsumableType> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.input('name', sql.NVarChar, name)
		.input('is_active', sql.Bit, is_active)
		.execute('dbo.CONSUMABLE_TYPES_EDIT_CONSUMABLE_TYPE');

	logger.info(result);

	const { returnValue } = result;
	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuat tipi bulunamadı.',
		};
		throw errorDetails;
	}
	return returnValue;
}

export async function deleteConsumableTypeService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ConsumableType> = await (await pool)
		.request()
		.input('id', id)
		.execute('dbo.CONSUMABLE_TYPES_DELETE_CONSUMABLE_TYPE');
	logger.info(result);

	const { returnValue } = result;

	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Matbuat tipi silinemedi.',
		};
		throw errorDetails;
	}
	return returnValue;
}
