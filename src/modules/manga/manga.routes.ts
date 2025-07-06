import express, {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware";
import {upload} from "../../utils/files.storage";
import {createMangaController, getMangaPerPageController, updateMangaController} from "./manga.controller";

const router = express.Router()

router.post('/create', authMiddleware, upload.array('images'), createMangaController);
router.patch('/update', authMiddleware, upload.array('images'), updateMangaController);
router.get('/', getMangaPerPageController);

export const MangaRoutes = router;