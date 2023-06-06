import { Router } from 'express';
import {
	getProductGroupController,
	getProductGroupsController,
	addProductGroupController,
	editProductGroupController,
	deleteProductGroupController,
} from '../controllers/product-groups.controller';
import validateResource from '../middlewares/validateResource';
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

router.get('/', getProductGroupsController);
router.get('/:id', getProductGroupController);
router.post('/', addProductGroupController);
router.put('/:id', editProductGroupController);
router.delete('/:id', deleteProductGroupController);

export default router;
