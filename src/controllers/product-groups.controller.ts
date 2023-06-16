import { Request, Response } from 'express';
import logger from '../utils/logger';

import { ProductGroup, ResponseObject } from '../data/models';
import {
	getProductGroupService,
	getProductGroupsService,
	addProductGroupService,
	editProductGroupService,
	deleteProductGroupService,
} from '../services/product-groups.service';

export async function getProductGroupsController(req: Request, res: Response) {
	try {
		const recordset = await getProductGroupsService();
		const responseObject: ResponseObject<ProductGroup[]> = {
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

export async function getProductGroupController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);
		const serviceResult = await getProductGroupService(idNumberFromRequest);
		const responseObject: ResponseObject<ProductGroup[]> = {
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

export async function addProductGroupController(req: Request, res: Response) {
	try {
		const { username } = res.locals.user;

		const { name, bank_id, client_id, description } = req.body;
		const productGroupToAdd: Omit<ProductGroup, 'id' | 'is_deleted'> = {
			name,
			bank_id,
			client_id,
			description,
			is_active: true,
		};

		const serviceResult = await addProductGroupService(productGroupToAdd, username);
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

export async function editProductGroupController(req: Request, res: Response) {
	try {
		const { username } = res.locals.user;

		const { name, is_active, bank_id, client_id, description } = req.body;
		const { id } = req.params;
		const parsedId = parseInt(id);

		const productGroupToEdit: ProductGroup = {
			id: parsedId,
			name,
			is_active,
			bank_id,
			client_id,
			description,
			is_deleted: false,
		};

		const serviceResult = await editProductGroupService(productGroupToEdit, username);

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

export async function deleteProductGroupController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);

		const serviceResult = await deleteProductGroupService(idNumberFromRequest);
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
