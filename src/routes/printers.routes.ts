import { Router } from 'express';
import {
	getPrinterController,
	getPrintersController,
	addPrinterController,
	editPrinterController,
	deletePrinterController,
} from '../controllers/printers.controller';
import validateResource from '../middlewares/validateResource';
import {
	getPrintersSchema,
	getPrinterSchema,
	addPrinterSchema,
	editPrinterSchema,
	deletePrinterSchema,
} from '../schemas/printers.schema';
import requireUser from '../middlewares/requireUser';

const router = Router();

router.get('/', requireUser, validateResource(getPrintersSchema), getPrintersController);
router.get('/:id', requireUser, validateResource(getPrinterSchema), getPrinterController);
router.post('/', requireUser, validateResource(addPrinterSchema), addPrinterController);
router.put('/:id', requireUser, validateResource(editPrinterSchema), editPrinterController);
router.delete('/:id', requireUser, validateResource(deletePrinterSchema), deletePrinterController);

export default router;
