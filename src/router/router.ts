import { Router } from 'express'
import {AuthRoutes} from "../modules/auth/auth.routes";
import {UserRoutes} from "../modules/user/user.routes";
import {MangaRoutes} from "../modules/manga/manga.routes";

const router = Router()

router.use("/auth", AuthRoutes)
router.use("/user", UserRoutes)
router.use("/manga", MangaRoutes)

export default router