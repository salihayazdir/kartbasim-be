import { Router } from 'express';
import {
	getProductTypesController,
	getProductTypeController,
	addProductTypeController,
	editProductTypeController,
	deleteProductTypeController,
} from '../controllers/product-types.controller';
import validateResource from '../middlewares/validateResource';
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

router.get('/', getProductTypesController);
router.get('/:id', getProductTypeController);
router.post('/', addProductTypeController);
router.put('/:id', editProductTypeController);
router.delete('/:id', deleteProductTypeController);

export default router;
