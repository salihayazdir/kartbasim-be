import logger from '../utils/logger';
import { ErrorDetails, ProductInventoryRecords } from '../data/models';
import utcOffset from '../utils/utcOffset';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';

const dbConfig = config.get<string>('db');

export async function getProductInventoryRecordsService() {
	const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
	const result: IProcedureResult<ProductInventoryRecords> = await (await pool)
		.request()
		.execute('dbo.PRODUCT_INVENTORY_RECORDS_GET_PRODUCT_INVENTORY_RECORDS');
	logger.info(result);

	const { recordset } = result;

	if (!recordset) {
		const errorDetails: ErrorDetails = {
			code: 'NOT_FOUND',
			message: 'Kayıt bulunamadi.',
		};
		throw errorDetails;
	}

	const recordsetDatesAdjusted: ProductInventoryRecords[] = recordset.map((record) => ({
		...record,
		created_at: record.created_at ? utcOffset(record.created_at).format() : record.created_at,
	}));
	return recordsetDatesAdjusted;
}
