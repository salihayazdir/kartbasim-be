import { Request, Response, Router } from 'express';
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

const router = Router();

router.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

router.get('/', validateResource(getPrintersSchema), getPrintersController);
router.get('/:id', validateResource(getPrinterSchema), getPrinterController);
router.post('/', validateResource(addPrinterSchema), addPrinterController);
router.put('/:id', validateResource(editPrinterSchema), editPrinterController);
router.delete('/:id', validateResource(deletePrinterSchema), deletePrinterController);

export default router;
