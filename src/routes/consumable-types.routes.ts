import { Router } from 'express';
import {
	getConsumableTypesController,
	getConsumableTypeController,
	addConsumableTypeController,
	editConsumableTypeController,
	deleteConsumableTypeController,
} from '../controllers/consumable-types.controller';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';
// import {
// 	getConsumableTypesSchema,
// 	getConsumableTypeSchema,
// 	addConsumableTypeSchema,
// 	editConsumableTypeSchema,
// 	deleteConsumableTypeSchema,
// } from '../schemas/consumable-Types.schema';

const router = Router();

// router.get('/', validateResource(getConsumableTypesSchema), getConsumableTypesController);
// router.get('/:id', validateResource(getConsumableTypeSchema), getConsumableTypeController);
// router.post('/', validateResource(addConsumableTypeSchema), addConsumableTypeController);
// router.put('/:id', validateResource(editConsumableTypeSchema), editConsumableTypeController);
// router.delete('/:id', validateResource(deleteConsumableTypeSchema), deleteConsumableTypeController);

router.get('/', requireUser, getConsumableTypesController);
router.get('/:id', requireUser, getConsumableTypeController);
router.post('/', requireUser, addConsumableTypeController);
router.put('/:id', requireUser, editConsumableTypeController);
router.delete('/:id', requireUser, deleteConsumableTypeController);

export default router;
