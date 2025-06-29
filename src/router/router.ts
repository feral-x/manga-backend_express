import { Router } from 'express'
import {authMiddleware} from "../middlewares/auth.middleware";
import {AuthRoutes} from "../modules/auth/auth.routes";

const router = Router()

router.use("/auth", AuthRoutes)

export default router