import { Router } from 'express'
import {authMiddleware} from "../middleware/auth.middleware";
import {testController} from "../controllers/auth.controller";

const router = Router()
router.post('/', authMiddleware, testController)
export default router