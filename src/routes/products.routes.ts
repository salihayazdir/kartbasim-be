import { Router } from 'express';
import {
	getProductsController,
	getProductController,
	addProductController,
	editProductController,
	deleteProductController,
} from '../controllers/products.controller';
import validateResource from '../middlewares/validateResource';
// import {
// 	getProductsSchema,
// 	getProductSchema,
// 	addProductSchema,
// 	editProductSchema,
// 	deleteProductSchema,
// } from '../schemas/product-Types.schema';

const router = Router();

// router.get('/', validateResource(getProductsSchema), getProductsController);
// router.get('/:id', validateResource(getProductSchema), getProductController);
// router.post('/', validateResource(addProductSchema), addProductController);
// router.put('/:id', validateResource(editProductSchema), editProductController);
// router.delete('/:id', validateResource(deleteProductSchema), deleteProductController);

router.get('/', getProductsController);
router.get('/:id', getProductController);
router.post('/', addProductController);
router.put('/:id', editProductController);
router.delete('/:id', deleteProductController);

export default router;
