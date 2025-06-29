import { Router } from 'express'
import {AuthRoutes} from "../modules/auth/auth.routes";
import {UserRoutes} from "../modules/user/user.routes";

const router = Router()

router.use("/auth", AuthRoutes)
router.use("/user", UserRoutes)

export default router