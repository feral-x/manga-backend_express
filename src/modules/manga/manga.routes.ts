import express, {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware";
import {upload} from "../../utils/files.storage";
import {createMangaController} from "./manga.controller";

const router = express.Router()

router.post('/create', authMiddleware, upload.array('images'), createMangaController);

export const MangaRoutes = router;