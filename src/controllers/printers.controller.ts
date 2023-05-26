import { Request, Response } from 'express';
import logger from '../utils/logger';
import {
	addPrinterService,
	getPrinterService,
	getPrintersService,
	editPrinterService,
	deletePrinterService,
} from '../services/printers.service';
import {
	GetPrintersInput,
	GetPrinterInput,
	AddPrinterInput,
	EditPrinterInput,
	DeletePrinterInput,
} from '../schemas/printers.schema';
import { Printer, ResponseObject } from '../data/models';

export async function getPrintersController(req: Request<GetPrintersInput['body']>, res: Response) {
	try {
		const printersRecordset = await getPrintersService();
		const responseObject: ResponseObject<Printer[]> = {
			error: false,
			data: printersRecordset,
		};
		return res.send(responseObject);
	} catch (err: any) {
		logger.error(err);
		return res.status(400).send(err.message);
	}
}

export async function getPrinterController(req: Request<GetPrinterInput['params']>, res: Response) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);
		const serviceResult = await getPrinterService(idNumberFromRequest);
		const responseObject: ResponseObject<Printer[]> = {
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

export async function addPrinterController(req: Request<AddPrinterInput['body']>, res: Response) {
	try {
		const { name, model, serial_no, description } = req.body;
		const printerToAdd: Omit<Printer, 'id' | 'is_deleted'> = {
			name,
			model,
			serial_no,
			description,
			is_active: true,
		};

		const serviceResult = await addPrinterService(printerToAdd);
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

export async function editPrinterController(
	req: Request<EditPrinterInput['params'], EditPrinterInput['body']>,
	res: Response
) {
	try {
		const { name, is_active, model, serial_no, description } = req.body;
		const { id } = req.params;
		const parsedId = parseInt(id);

		const printerToEdit: Printer = {
			id: parsedId,
			name: name,
			is_active: is_active,
			model: model,
			serial_no: serial_no,
			description: description,
			is_deleted: false,
		};

		const serviceResult = await editPrinterService(printerToEdit);

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

export async function deletePrinterController(
	req: Request<DeletePrinterInput['params']>,
	res: Response
) {
	try {
		const idFromRequest: string = req.params.id;
		const idNumberFromRequest: number = parseInt(idFromRequest);

		const serviceResult = await deletePrinterService(idNumberFromRequest);
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
