import { Router } from 'express';
import requireUser from '../middlewares/requireUser';
import { getProductInventoryRecordsController } from '../controllers/product-inventory-records.controller';

const router = Router();

router.get('/', requireUser, getProductInventoryRecordsController);

export default router;
