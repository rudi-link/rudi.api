import { Router } from 'express';
import { protectAuth } from '../../middleware/auth-middleware';
import { generateAuto, generateManual, getAll, getOne, use } from './api.controller';

const router = Router();

router.get('/all', protectAuth, getAll)
router.get('/:id', protectAuth, getOne)
router.post('/manual', protectAuth, generateManual)
router.post('/auto', protectAuth, generateAuto)
router.get('/use/:id', use)

export { router as ApiRouter };
