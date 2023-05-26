import { Request, Response, Router } from 'express';
import {
	getBankController,
	getBanksController,
	addBankController,
	editBankController,
	deleteBankController,
} from '../controllers/banks.controller';
import { test } from '../controllers/auth.controller';
// import validateResource from '../middlewares/validateResource';
// import {
// 	getBanksSchema,
// 	getBankSchema,
// 	addBankSchema,
// 	editBankSchema,
// 	deleteBankSchema,
// } from '../schemas/banks.schema';

const router = Router();

router.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

router.get('/', test);

export default router;
