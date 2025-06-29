import * as jwt from 'jsonwebtoken';
import {createPairTokens, saveTokens} from "../utils/tokens-utils";
import {JwtPayloadWithId} from "../utils/jwt.types";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction):Promise<void> => {

	const token = req.cookies?.token;
	const refreshToken = req.cookies?.refresh_token;
	
	
	if(!token) {
		res.status(401).json({message: "No token provided"});
		return;
	}
	
		
	try {
		const decodeToken = process.env.JWT_SECRET || 'no token provided';
		const verified = jwt.verify(token, decodeToken) as JwtPayloadWithId;
		const {id} = verified;
		(req as any).user = {id}
		return next()
	} catch (error) {
		try {
			if(!refreshToken) {
				res.status(401).json({message: "No refresh token provided"});
				return;
			}
			const decodeToken = process.env.JWT_SECRET || 'no token provided';
			const verified = jwt.verify(refreshToken, decodeToken) as JwtPayloadWithId;
			const {id} = verified;
			(req as any).user = {id}
			
			const {token, refreshToken: refresh_token} = createPairTokens(req, res, verified.id)
			
			saveTokens(res, {token, refresh_token})
			
			return next()
		} catch (error) {
			res.clearCookie("token");
			res.clearCookie("refresh_token");
			res.status(401).json({message: "Bad tokens"});
			return;
		}
	}
}