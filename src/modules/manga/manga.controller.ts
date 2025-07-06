import {Request, Response} from "express"
import {ZodValidate} from "../../utils/zod.validate";
import {createMangaShema} from "./dto/manga.schema";
import {prisma} from "../../prisma/prisma";
import {saveFiles} from "../../utils/files.storage";

export const createMangaController = async (req: Request, res: Response) => {
	req.body.genres = JSON.parse(req.body.genres);
	const validate = ZodValidate(createMangaShema, req, res)
	if (!validate) {
		res.status(400).json({
			message: "Manga Create Failed, bad data"
		})
		return
	}
	
	if(req.files?.length === 0) {
		res.status(400).json({
			message: "Manga Create Failed, no files were found"
		})
		return
	}
	
	
	const manga_transaction = await prisma.$transaction(async tx => {
		const createManga = await tx.manga.create({
			data: {
				title: req.body.title,
				description: req.body.description,
				author: req.body.author,
			}
		})
		
		await tx.manga.update({
			where: {
				id: createManga.id
			},
			data: {
				genres: {
					connect: req.body.genres.map((id:number) => ({id}))
				}
			}
		})
		
		const paths = await saveFiles(req.files as Express.Multer.File[], createManga.id)
		
		await tx.images.createMany({
			data: paths.map((path, index)=>({
				path,
				pageNumber: index + 1,
				mangaId: createManga.id
			}))
		})
		
		return tx.manga.findUnique({where: {id: createManga.id}, include: {genres: true, images: true}})
	})
	
	
	
	res.status(201).json(manga_transaction)
	return
}