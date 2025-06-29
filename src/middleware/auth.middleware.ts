import * as jwt from 'jsonwebtoken';
import {createPairTokens} from "../utils/create-tokens";
import {JwtPayload} from "jsonwebtoken";
import {JwtPayloadWithId} from "../utils/jwt.types";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
	const {token: temp_token, refreshToken: refresh_token} = createPairTokens(req, res, "1")
	
	
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
			
			return next()
		} catch (error) {
			res.clearCookie("token");
			res.clearCookie("refresh_token");
			res.status(401).json({message: "Bad tokens"});
			return;
		}
	}
}