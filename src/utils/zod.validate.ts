import {z, ZodObject} from 'zod'
import {Request, Response} from "express";

export const ZodValidate = (shema: ZodObject<any>, req: Request, res: Response) => {
	const result = shema.safeParse(req.body);
	if(!result.success) return false;
	return true;
}