import { Request, Response } from 'express';
import logger from '../utils/logger';

import { ProductType, ResponseObject } from '../data/models';
import {
	getProductTypeService,
	getProductTypesService,
	addProductTypeService,
	editProductTypeService,
	deleteProductTypeService,
} from '../services/product-types.service';

export async function getProductTypesController(req: Request, res: Response) {
	try {
		const recordset = await getProductTypesService();
		const responseObject: ResponseObject<ProductType[]> = {
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

export async function getProductTypeController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);
		const serviceResult = await getProductTypeService(idNumberFromRequest);
		const responseObject: ResponseObject<ProductType[]> = {
			error: false,
			data: serviceResult,
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

export async function addProductTypeController(req: Request, res: Response) {
	try {
		const { name } = req.body;
		const productTypeToAdd: Omit<ProductType, 'id' | 'is_deleted'> = {
			name,
			is_active: true,
		};

		const serviceResult = await addProductTypeService(productTypeToAdd);
		const responseObject: ResponseObject<{ insertedId: number }> = {
			error: false,
			data: {
				insertedId: serviceResult,
			},
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

export async function editProductTypeController(req: Request, res: Response) {
	try {
		const { name, is_active } = req.body;
		const { id } = req.params;
		const parsedId = parseInt(id);

		const productTypeToEdit: ProductType = {
			id: parsedId,
			name,
			is_active,
			is_deleted: false,
		};

		const serviceResult = await editProductTypeService(productTypeToEdit);

		const responseObject: ResponseObject<{ editedId: number }> = {
			error: false,
			data: {
				editedId: serviceResult,
			},
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

export async function deleteProductTypeController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);

		const serviceResult = await deleteProductTypeService(idNumberFromRequest);
		const responseObject: ResponseObject<{ deletedId: number }> = {
			error: false,
			data: {
				deletedId: serviceResult,
			},
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
