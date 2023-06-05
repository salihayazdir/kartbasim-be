import { Router } from 'express';
import {
	getBankController,
	getBanksController,
	addBankController,
	editBankController,
	deleteBankController,
} from '../controllers/banks.controller';
import validateResource from '../middlewares/validateResource';
import {
	getBanksSchema,
	getBankSchema,
	addBankSchema,
	editBankSchema,
	deleteBankSchema,
} from '../schemas/banks.schema';
import requireUser from '../middlewares/requireUser';

const router = Router();

router.get('/', requireUser, validateResource(getBanksSchema), getBanksController);
router.get('/:id', validateResource(getBankSchema), getBankController);
router.post('/', validateResource(addBankSchema), addBankController);
router.put('/:id', validateResource(editBankSchema), editBankController);
router.delete('/:id', validateResource(deleteBankSchema), deleteBankController);

export default router;
