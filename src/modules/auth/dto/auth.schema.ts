import { z } from 'zod';
export const CreateUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
})

export const LoginUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
})