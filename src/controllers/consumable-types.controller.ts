import { Request, Response } from 'express';
import logger from '../utils/logger';

import { ConsumableType, ResponseObject } from '../data/models';
import {
	getConsumableTypeService,
	getConsumableTypesService,
	addConsumableTypeService,
	editConsumableTypeService,
	deleteConsumableTypeService,
} from '../services/consumable-types.service';

export async function getConsumableTypesController(req: Request, res: Response) {
	try {
		const recordset = await getConsumableTypesService();
		const responseObject: ResponseObject<ConsumableType[]> = {
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

export async function getConsumableTypeController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);
		const serviceResult = await getConsumableTypeService(idNumberFromRequest);
		const responseObject: ResponseObject<ConsumableType[]> = {
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

export async function addConsumableTypeController(req: Request, res: Response) {
	try {
		const { username } = res.locals.user;

		const { name } = req.body;
		const consumableTypeToAdd: Omit<ConsumableType, 'id' | 'is_deleted'> = {
			name,
			is_active: true,
		};

		const serviceResult = await addConsumableTypeService(consumableTypeToAdd, username);
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

export async function editConsumableTypeController(req: Request, res: Response) {
	try {
		const { username } = res.locals.user;

		const { name, is_active } = req.body;
		const { id } = req.params;
		const parsedId = parseInt(id);

		const consumableTypeToEdit: ConsumableType = {
			id: parsedId,
			name,
			is_active,
			is_deleted: false,
		};

		const serviceResult = await editConsumableTypeService(consumableTypeToEdit, username);

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

export async function deleteConsumableTypeController(req: Request, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);

		const serviceResult = await deleteConsumableTypeService(idNumberFromRequest);
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
