import { Router } from 'express';
import {GetProfile} from "./user.controller";
import {authMiddleware} from "../../middlewares/auth.middleware";

const router = Router();

router.get('/:id', authMiddleware, GetProfile)

export const UserRoutes = router;