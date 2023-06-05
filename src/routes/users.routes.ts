import { Router } from 'express';
import { getUserController, updateUsersController } from '../controllers/users.controller';
import requireUser from '../middlewares/requireUser';

const router = Router();

router.get('/me', requireUser, getUserController);
router.get('/update', updateUsersController);

export default router;
