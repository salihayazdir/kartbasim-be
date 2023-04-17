import { Express, Request, Response } from 'express';
import {
	getBankController,
	getBanksController,
	addBankController,
	editBankController,
	deleteBankController,
} from './controller/bank.controller';
import validateResource from './middleware/validateResource';
import {
	getBanksSchema,
	getBankSchema,
	addBankSchema,
	editBankSchema,
	deleteBankSchema,
} from './schema/bank.schema';

export default function routes(app: Express) {
	app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

	app.get('/api/banks', validateResource(getBanksSchema), getBanksController);
	app.get('/api/banks/:bankId', validateResource(getBankSchema), getBankController);
	app.post('/api/banks', validateResource(addBankSchema), addBankController);
	app.put('/api/banks/:bankId', validateResource(editBankSchema), editBankController);
	app.delete('/api/banks/:bankId', validateResource(deleteBankSchema), deleteBankController);
}
