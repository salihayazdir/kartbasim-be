import { Router } from 'express';
import {
	getConsumablesController,
	getConsumableController,
	addConsumableController,
	editConsumableController,
	deleteConsumableController,
} from '../controllers/consumables.controller';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';
// import {
// 	getConsumablesSchema,
// 	getConsumableSchema,
// 	addConsumableSchema,
// 	editConsumableSchema,
// 	deleteConsumableSchema,
// } from '../schemas/consumable-Types.schema';

const router = Router();

// router.get('/', validateResource(getConsumablesSchema), getConsumablesController);
// router.get('/:id', validateResource(getConsumableSchema), getConsumableController);
// router.post('/', validateResource(addConsumableSchema), addConsumableController);
// router.put('/:id', validateResource(editConsumableSchema), editConsumableController);
// router.delete('/:id', validateResource(deleteConsumableSchema), deleteConsumableController);

router.get('/', requireUser, getConsumablesController);
router.get('/:id', requireUser, getConsumableController);
router.post('/', requireUser, addConsumableController);
router.put('/:id', requireUser, editConsumableController);
router.delete('/:id', requireUser, deleteConsumableController);

export default router;
