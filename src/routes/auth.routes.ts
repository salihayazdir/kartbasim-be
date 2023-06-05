import { Router } from 'express';
import {
	createSessionController,
	logoutController,
	loginController,
	refreshSessionController,
} from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/session', createSessionController);
router.post('/refresh', refreshSessionController);

export default router;
