import logger from '../utils/logger';
import { ProductGroup, ErrorDetails, ProductType } from '../data/models';
import utcOffset from '../utils/utcOffset';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';

const dbConfig = config.get<string>('db');

export async function getProductTypesService() {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductType> = await (await pool)
		.request()
		.execute('dbo.PRODUCT_TYPES_GET_PRODUCT_TYPES');
	logger.info(result);

	const { recordset } = result;

	if (!recordset) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün türleri bulunamadi.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: ProductType[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));
	return recordsetDatesAdjusted;
}

export async function getProductTypeService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductType> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.execute('dbo.PRODUCT_TYPES_GET_PRODUCT_TYPE');
	logger.info(result);

	const { recordset } = result;

	if (recordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün tipi bulunamadı.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: ProductType[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));

	return recordsetDatesAdjusted;
}

export async function addProductTypeService(
	productType: Omit<ProductType, 'id' | 'is_deleted'>,
	username: string
): Promise<number> {
	const { name } = productType;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductType> = await (await pool)
		.request()
		.input('name', sql.NVarChar, name)
		.input('created_by', sql.NVarChar, username)
		.execute('dbo.PRODUCT_TYPES_ADD_PRODUCT_TYPE');
	logger.info(result);

	const { returnValue } = result;
	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün tipi eklenemedi.',
		};
		throw errorDetails;
	}

	return result.returnValue;
}

export async function editProductTypeService(productType: ProductType, username: string) {
	const { id, name, is_active } = productType;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductType> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.input('name', sql.NVarChar, name)
		.input('is_active', sql.Bit, is_active)
		.input('edited_by', sql.NVarChar, username)
		.execute('dbo.PRODUCT_TYPES_EDIT_PRODUCT_TYPE');

	logger.info(result);

	const { returnValue } = result;
	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün tipi bulunamadı.',
		};
		throw errorDetails;
	}
	return returnValue;
}

export async function deleteProductTypeService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductType> = await (await pool)
		.request()
		.input('id', id)
		.execute('dbo.PRODUCT_TYPES_DELETE_PRODUCT_TYPE');
	logger.info(result);

	const { returnValue } = result;

	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün tipi silinemedi.',
		};
		throw errorDetails;
	}
	return returnValue;
}
