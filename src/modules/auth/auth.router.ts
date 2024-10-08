import { Router } from 'express';
import { auth, login, register } from './auth.controller';
import { protectAuth } from '../../middleware/auth-middleware';

const router = Router();

router.post('/', register);
router.post('/login', login);
router.get('/', protectAuth, auth)

export { router as AuthRouter };