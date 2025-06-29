import {Request, Response} from "express";
import * as jwt from 'jsonwebtoken';

export const createPairTokens = (req: Request, res: Response, id: number) => {
	const decodeToken = process.env.JWT_SECRET;
	if(!decodeToken) throw new Error('Env token not found');
	const token = jwt.sign({id}, decodeToken, {
		expiresIn: '15m',
	});
	const refresh_token = jwt.sign({id}, decodeToken, {
		expiresIn: '7d',
	})
	
	return {
		token, refresh_token
	};
}

export const saveTokens = (res: Response, {token, refresh_token}: { token: string, refresh_token: string}) => {
	res.cookie("token", token, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 15 * 60 * 1000,
	})
	res.cookie("refresh_token", refresh_token, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 7 * 24 * 60 * 60 * 1000 * 2,
	})
};