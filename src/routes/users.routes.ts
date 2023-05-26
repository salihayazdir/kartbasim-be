import { Request, Response, Router } from 'express';
import {
	getBankController,
	getBanksController,
	addBankController,
	editBankController,
	deleteBankController,
} from '../controllers/banks.controller';
import { updateUsersController } from '../controllers/users.controller';
// import validateResource from '../middlewares/validateResource';
// import {
// 	getBanksSchema,
// 	getBankSchema,
// 	addBankSchema,
// 	editBankSchema,
// 	deleteBankSchema,
// } from '../schemas/banks.schema';

const router = Router();

router.get('/', updateUsersController);

export default router;
