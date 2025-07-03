import { z } from 'zod';
export const createMangaShema = z.object({
	title: z.string(),
	description: z.string(),
	genres: z.array(z.number().min(1)),
})