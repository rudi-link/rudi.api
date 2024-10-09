import { Router } from "express";
import { protectAuth } from "../../middleware/auth-middleware";
import { create, get, use } from "./link.controller";

const router = Router()

router.get('/get/:id', protectAuth, get)
router.post('/', protectAuth, create);
router.get('/:id', use)

export {router as LinkRouter}