import {Request, Response} from "express"
import {ZodValidate} from "../../utils/zod.validate";
import {createMangaShema} from "./dto/manga.schema";
import {prisma} from "../../prisma/prisma";
import {saveFiles} from "../../utils/files.storage";
import { Prisma } from "@prisma/client";

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

export const updateMangaController = async (req: Request, res: Response):Promise<void> => {
	
	if(!req.query.id){
		res.status(400).json({
			message: "Manga Update Failed, bad id"
		})
		return
	}
	
	let id: number = +req.query.id
	const manga = await prisma.manga.findUnique({where: {id: id}})
	if (!manga) {
		res.status(404).json({
			message: "Manga Update Failed, bad data"
		})
		return
	}
	
	const data: Prisma.MangaUpdateInput = {}
	if(req.body.title !== null) data.title = req.body.title
	if(req.body.description !== null) data.description = req.body.description
	if(req.body.author !== null) data.author  = req.body.author
	
	const paths = await saveFiles(req.files as Express.Multer.File[], id)
	
	const updateTransaction = await prisma.$transaction(async tx => {
		const updateManga = await tx.manga.updateMany({
			where: {
				id: id
			},
			data: {
				title: data.title,
				description: data.description,
				author: data.author,
			}
		})
		
		await tx.images.deleteMany({
			where: {
				mangaId: id
			}
		})
		
		await tx.images.createMany({
			data: paths.map((path, index)=>({
				path,
				pageNumber: index + 1,
				mangaId: id
			}))
		})
		
		return {
			message: `Manga update complete`
		}
		
	})
	
	res.status(200).json({
		updateTransaction
	})

	return
}