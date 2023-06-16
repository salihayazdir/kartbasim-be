import { Router } from 'express';
import {
	getProductTypesController,
	getProductTypeController,
	addProductTypeController,
	editProductTypeController,
	deleteProductTypeController,
} from '../controllers/product-types.controller';
import validateResource from '../middlewares/validateResource';
import requireUser from '../middlewares/requireUser';
// import {
// 	getProductTypesSchema,
// 	getProductTypeSchema,
// 	addProductTypeSchema,
// 	editProductTypeSchema,
// 	deleteProductTypeSchema,
// } from '../schemas/product-Types.schema';

const router = Router();

// router.get('/', validateResource(getProductTypesSchema), getProductTypesController);
// router.get('/:id', validateResource(getProductTypeSchema), getProductTypeController);
// router.post('/', validateResource(addProductTypeSchema), addProductTypeController);
// router.put('/:id', validateResource(editProductTypeSchema), editProductTypeController);
// router.delete('/:id', validateResource(deleteProductTypeSchema), deleteProductTypeController);

router.get('/', requireUser, getProductTypesController);
router.get('/:id', requireUser, getProductTypeController);
router.post('/', requireUser, addProductTypeController);
router.put('/:id', requireUser, editProductTypeController);
router.delete('/:id', requireUser, deleteProductTypeController);

export default router;
