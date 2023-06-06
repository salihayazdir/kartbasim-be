import { Request, Response } from 'express';
import logger from '../utils/logger';

import { Product, ResponseObject } from '../data/models';
import {
	getProductService,
	getProductsService,
	addProductService,
	editProductService,
	deleteProductService,
} from '../services/products.service';

export async function getProductsController(req: Request, res: Response) {
	try {
		const recordset = await getProductsService();
		const responseObject: ResponseObject<Product[]> = {
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

export async function getProductController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);
		const serviceResult = await getProductService(idNumberFromRequest);
		const responseObject: ResponseObject<Product[]> = {
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

export async function addProductController(req: Request, res: Response) {
	try {
		const { name, product_group_id, product_type_id, client_id, description } = req.body;
		const productToAdd: Omit<Product, 'id' | 'is_deleted'> = {
			name,
			product_group_id,
			product_type_id,
			client_id,
			description,
			is_active: true,
		};

		const serviceResult = await addProductService(productToAdd);
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

export async function editProductController(req: Request, res: Response) {
	try {
		const { name, product_group_id, product_type_id, client_id, description, is_active } = req.body;
		const { id } = req.params;
		const parsedId = parseInt(id);

		const productToEdit: Product = {
			id: parsedId,
			name,
			product_group_id,
			product_type_id,
			client_id,
			description,
			is_active,
			is_deleted: false,
		};

		const serviceResult = await editProductService(productToEdit);

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

export async function deleteProductController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);

		const serviceResult = await deleteProductService(idNumberFromRequest);
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
