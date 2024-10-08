import { Router } from "express";
import { getAll, getOne, visite } from "./visite.controller";
import { protectAuth } from "../../middleware/auth-middleware";

const router = Router()

router.get('/', protectAuth, getOne)
router.get('/all', protectAuth, getAll)
router.put('/', protectAuth, visite)

export { router as VisiteRouter };