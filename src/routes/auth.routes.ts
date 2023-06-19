import { Router } from 'express';
import {
	createSessionController,
	logoutController,
	loginController,
	refreshSessionController,
} from '../controllers/auth.controller';
import deserializeRefreshToken from '../middlewares/deserializeRefreshToken';

const router = Router();

router.post('/login', loginController);
router.post('/session', createSessionController);
router.get('/refresh', deserializeRefreshToken, refreshSessionController);
router.get('/logout', logoutController);

export default router;
