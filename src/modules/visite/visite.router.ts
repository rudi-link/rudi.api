import { Router } from "express";
import { create, getAll, getOne, visite } from "./visite.controller";
import { protectAuth } from "../../middleware/auth-middleware";

const router = Router()

router.get('/', protectAuth, getOne)
router.get('/all', protectAuth, getAll)
router.post('/', protectAuth, create)
router.put('/', protectAuth, visite)

export { router as VisiteRouter };