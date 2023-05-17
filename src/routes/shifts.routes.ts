import { Request, Response, Router } from 'express';
import {
	getShiftController,
	getShiftsController,
	addShiftController,
	editShiftController,
	deleteShiftController,
} from '../controllers/shifts.controller';
import validateResource from '../middlewares/validateResource';
import {
	getShiftsSchema,
	getShiftSchema,
	addShiftSchema,
	editShiftSchema,
	deleteShiftSchema,
} from '../schemas/shifts.schema';

const router = Router();

router.get('/', validateResource(getShiftsSchema), getShiftsController);
router.get('/:id', validateResource(getShiftSchema), getShiftController);
router.post('/', validateResource(addShiftSchema), addShiftController);
router.put('/:id', validateResource(editShiftSchema), editShiftController);
router.delete('/:id', validateResource(deleteShiftSchema), deleteShiftController);

export default router;
