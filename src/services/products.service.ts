import logger from '../utils/logger';
import { ErrorDetails, Product } from '../data/models';
import utcOffset from '../utils/utcOffset';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';

const dbConfig = config.get<string>('db');

export async function getProductsService() {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Product> = await (await pool)
		.request()
		.execute('dbo.PRODUCTS_GET_PRODUCTS');
	logger.info(result);

	const { recordset } = result;

	if (!recordset) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürünler bulunamadi.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: Product[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));
	return recordsetDatesAdjusted;
}

export async function getProductService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Product> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.execute('dbo.PRODUCTS_GET_PRODUCT');
	logger.info(result);

	const { recordset } = result;

	if (recordset.length !== 1) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün bulunamadı.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: Product[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
		edited_at: record.edited_at ? utcOffset(record.edited_at).format() : record.edited_at,
	}));

	return recordsetDatesAdjusted;
}

export async function addProductService(
	Product: Omit<Product, 'id' | 'is_deleted'>,
	username: string
): Promise<number> {
	const { name, product_group_id, product_type_id, client_id, description } = Product;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Product> = await (await pool)
		.request()
		.input('name', sql.NVarChar, name)
		.input('product_group_id', sql.Int, product_group_id)
		.input('product_type_id', sql.Int, product_type_id)
		.input('client_id', sql.NVarChar, client_id)
		.input('description', sql.NVarChar, description)
		.input('created_by', sql.NVarChar, username)
		.execute('dbo.PRODUCTS_ADD_PRODUCT');
	logger.info(result);

	const { returnValue } = result;
	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün eklenemedi.',
		};
		throw errorDetails;
	}

	return result.returnValue;
}

export async function editProductService(Product: Product, username: string) {
	const { id, name, product_group_id, product_type_id, client_id, description, is_active } =
		Product;

	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Product> = await (await pool)
		.request()
		.input('id', sql.Int, id)
		.input('name', sql.NVarChar, name)
		.input('is_active', sql.Bit, is_active)
		.input('product_group_id', sql.Int, product_group_id)
		.input('product_type_id', sql.Int, product_type_id)
		.input('client_id', sql.NVarChar, client_id)
		.input('description', sql.NVarChar, description)
		.input('edited_by', sql.NVarChar, username)
		.execute('dbo.PRODUCTS_EDIT_PRODUCT');

	logger.info(result);

	const { returnValue } = result;
	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün bulunamadı.',
		};
		throw errorDetails;
	}
	return returnValue;
}

export async function deleteProductService(id: number) {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<Product> = await (await pool)
		.request()
		.input('id', id)
		.execute('dbo.PRODUCTS_DELETE_PRODUCT');
	logger.info(result);

	const { returnValue } = result;

	if (!(returnValue > -1)) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Ürün silinemedi.',
		};
		throw errorDetails;
	}
	return returnValue;
}
