import { Request, Response } from 'express';
import logger from '../utils/logger';
import {
	addShiftService,
	getShiftService,
	getShiftsService,
	editShiftService,
	deleteShiftService,
} from '../services/shifts.service';
import {
	GetShiftsInput,
	GetShiftInput,
	AddShiftInput,
	EditShiftInput,
	DeleteShiftInput,
} from '../schemas/shifts.schema';
import { Shift, ResponseObject } from '../data/models';

export async function getShiftsController(req: Request<GetShiftsInput['body']>, res: Response) {
	try {
		const ShiftsRecordset = await getShiftsService();
		const responseObject: ResponseObject<Shift[]> = {
			error: false,
			data: ShiftsRecordset,
		};
		return res.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		return res.status(400).send(err.message);
	}
}

export async function getShiftController(req: Request<GetShiftInput['params']>, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);
		const serviceResult = await getShiftService(idNumberFromRequest);
		const responseObject: ResponseObject<Shift[]> = {
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

export async function addShiftController(
	req: Request<AddShiftInput['params'], AddShiftInput['body']>,
	res: Response
) {
	try {
		const { description, start_hour, end_hour } = req.body;
		const shiftToAdd: Omit<Shift, 'id' | 'is_deleted'> = {
			description,
			start_hour,
			end_hour,
			is_active: true,
		};

		const serviceResult = await addShiftService(shiftToAdd);
		const responseObject: ResponseObject<{ insertedShiftId: number }> = {
			error: false,
			data: {
				insertedShiftId: serviceResult,
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

export async function editShiftController(
	req: Request<EditShiftInput['params'], EditShiftInput['body']>,
	res: Response
) {
	try {
		const { description, start_hour, end_hour, is_active } = req.body;
		const { id } = req.params;
		const parsedId = parseInt(id);

		const shiftToEdit: Shift = {
			id: parsedId,
			description: description,
			start_hour: start_hour,
			end_hour: end_hour,
			is_active: is_active,
			is_deleted: false,
		};

		const serviceResult = await editShiftService(shiftToEdit);

		const responseObject: ResponseObject<{ editedShiftId: number }> = {
			error: false,
			data: {
				editedShiftId: serviceResult,
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

export async function deleteShiftController(
	req: Request<DeleteShiftInput['params']>,
	res: Response
) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);
		const serviceResult = await deleteShiftService(idNumberFromRequest);
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
