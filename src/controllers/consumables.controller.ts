import { Request, Response } from 'express';
import logger from '../utils/logger';

import { Consumable, ResponseObject } from '../data/models';
import {
	getConsumableService,
	getConsumablesService,
	addConsumableService,
	editConsumableService,
	deleteConsumableService,
} from '../services/consumables.service';

export async function getConsumablesController(req: Request, res: Response) {
	try {
		const recordset = await getConsumablesService();
		const responseObject: ResponseObject<Consumable[]> = {
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

export async function getConsumableController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);
		const serviceResult = await getConsumableService(idNumberFromRequest);
		const responseObject: ResponseObject<Consumable[]> = {
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

export async function addConsumableController(req: Request, res: Response) {
	try {
		const { name, consumable_type_id } = req.body;
		const consumableToAdd: Omit<Consumable, 'id' | 'stock_quantity' | 'is_deleted'> = {
			name,
			consumable_type_id,
			is_active: true,
		};

		const serviceResult = await addConsumableService(consumableToAdd);
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

export async function editConsumableController(req: Request, res: Response) {
	try {
		const { name, consumable_type_id, is_active } = req.body;
		const { id } = req.params;
		const parsedId = parseInt(id);

		const consumableToEdit: Omit<Consumable, 'stock_quantity'> = {
			id: parsedId,
			name,
			consumable_type_id,
			is_active,
			is_deleted: false,
		};

		const serviceResult = await editConsumableService(consumableToEdit);

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

export async function deleteConsumableController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);

		const serviceResult = await deleteConsumableService(idNumberFromRequest);
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
