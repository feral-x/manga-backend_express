import express, {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware";
import {upload} from "../../utils/files.storage";
import {createMangaController, updateMangaController} from "./manga.controller";

const router = express.Router()

router.post('/create', authMiddleware, upload.array('images'), createMangaController);
router.post('/update', authMiddleware, upload.array('images'), updateMangaController);

export const MangaRoutes = router;