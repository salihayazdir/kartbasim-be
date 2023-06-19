import { Request, Response } from 'express';
import logger from '../utils/logger';

import { ProductInventoryRecords, ResponseObject } from '../data/models';
import { getProductInventoryRecordsService } from '../services/product-inventory-records.service';

export async function getProductInventoryRecordsController(req: Request, res: Response) {
	try {
		const recordset = await getProductInventoryRecordsService();
		const responseObject: ResponseObject<ProductInventoryRecords[]> = {
			error: false,
			data: recordset,
		};
		return res.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		const responseObject: ResponseObject<null> = {
			error: err,
			data: null,
		};
		return res.status(400).send(responseObject);
	}
}
