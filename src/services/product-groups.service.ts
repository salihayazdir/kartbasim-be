import logger from '../utils/logger';
import { ProductGroup, ErrorDetails } from '../data/models';
import utcOffset from '../utils/utcOffset';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';

const dbConfig = config.get<string>('dev.db');

export async function getProductGroupsService() {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductGroup> = await (await pool)
		.request()
		.execute('dbo.PRODUCT_GROUPS_GET_PRODUCT_GROUPS');
	logger.info(result);

	const { recordset } = result;

	if (!recordset) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün grubu bulunamadi.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: ProductGroup[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));
	return recordsetDatesAdjusted;
}

export async function getProductGroupService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductGroup> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.execute('dbo.PRODUCT_GROUPS_GET_PRODUCT_GROUP');
	logger.info(result);

	const { recordset } = result;
	if (recordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün grubu bulunamadi.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: ProductGroup[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));

	return recordsetDatesAdjusted;
}

export async function addProductGroupService(
	productGroup: Omit<ProductGroup, 'id' | 'is_deleted'>
): Promise<number> {
	const { name, bank_id, description } = productGroup;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductGroup> = await (await pool)
		.request()
		.input('name', sql.NVarChar, name)
		.input('bank_id', sql.Int, bank_id)
		.input('description', sql.NVarChar, description)
		.execute('dbo.PRODUCT_GROUPS_ADD_PRODUCT_GROUP');
	logger.info(result);

	const { returnValue } = result;

	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün grubu eklenemedi.',
		};
		throw errorDetails;
	}

	return result.returnValue;
}

export async function editProductGroupService(productGroup: ProductGroup) {
	const { id, name, bank_id, description, is_active } = productGroup;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductGroup> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.input('name', sql.NVarChar, name)
		.input('bank_id', sql.Int, bank_id)
		.input('description', sql.NVarChar, description)
		.input('is_active', sql.Bit, is_active)
		.execute('dbo.PRODUCT_GROUPS_EDIT_PRODUCT_GROUP');

	logger.info(result);

	const { returnValue } = result;
	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün grubu bulunamadi.',
		};
		throw errorDetails;
	}
	return returnValue;
}

export async function deleteProductGroupService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductGroup> = await (await pool)
		.request()
		.input('id', id)
		.execute('dbo.PRODUCT_GROUPS_DELETE_PRODUCT_GROUP');
	logger.info(result);

	const { returnValue } = result;

	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün grubu silinemedi.',
		};
		throw errorDetails;
	}
	return returnValue;
}
