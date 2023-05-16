import { Request, Response, Router } from 'express';
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

const router = Router();

router.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

router.get('/', validateResource(getBanksSchema), getBanksController);
router.get('/:id', validateResource(getBankSchema), getBankController);
router.post('/', validateResource(addBankSchema), addBankController);
router.put('/:id', validateResource(editBankSchema), editBankController);
router.delete('/:id', validateResource(deleteBankSchema), deleteBankController);

export default router;
