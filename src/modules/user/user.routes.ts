import express from 'express';
import {GetProfile} from "./user.controller";
import {authMiddleware} from "../../middlewares/auth.middleware";

const router = express.Router();

router.get('/:id', authMiddleware, GetProfile)

export const UserRoutes = router;