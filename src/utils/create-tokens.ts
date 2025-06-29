import {Request, Response} from "express";
import * as jwt from 'jsonwebtoken';

export const createPairTokens = (req: Request, res: Response, id: string) => {
	const decodeToken = process.env.JWT_SECRET;
	if(!decodeToken) throw new Error('Env token not found');
	const token = jwt.sign({id}, decodeToken, {
		expiresIn: '15m',
	});
	const refreshToken = jwt.sign({id}, decodeToken, {
		expiresIn: '7d',
	})
	
	return {
		token, refreshToken
	};
}