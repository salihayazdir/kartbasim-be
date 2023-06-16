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
router.post('/logout', logoutController);
router.post('/session', createSessionController);
router.get('/refresh', deserializeRefreshToken, refreshSessionController);

export default router;
