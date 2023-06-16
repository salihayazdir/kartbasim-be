import { Router } from 'express';
import {
	getProductGroupController,
	getProductGroupsController,
	addProductGroupController,
	editProductGroupController,
	deleteProductGroupController,
} from '../controllers/product-groups.controller';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';
// import {
// 	getProductGroupsSchema,
// 	getProductGroupSchema,
// 	addProductGroupSchema,
// 	editProductGroupSchema,
// 	deleteProductGroupSchema,
// } from '../schemas/product-groups.schema';

const router = Router();

// router.get('/', validateResource(getProductGroupsSchema), getProductGroupsController);
// router.get('/:id', validateResource(getProductGroupSchema), getProductGroupController);
// router.post('/', validateResource(addProductGroupSchema), addProductGroupController);
// router.put('/:id', validateResource(editProductGroupSchema), editProductGroupController);
// router.delete('/:id', validateResource(deleteProductGroupSchema), deleteProductGroupController);

router.get('/', requireUser, getProductGroupsController);
router.get('/:id', requireUser, getProductGroupController);
router.post('/', requireUser, addProductGroupController);
router.put('/:id', requireUser, editProductGroupController);
router.delete('/:id', requireUser, deleteProductGroupController);

export default router;
