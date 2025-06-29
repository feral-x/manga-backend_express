import {Request, Response} from "express";
import {prisma} from "../../prisma/prisma";
import {ZodValidate} from "../../utils/zod.validate";
import {CreateUserSchema, LoginUserSchema} from "./dto/auth.schema";
import {createPairTokens, saveTokens} from "../../utils/tokens-utils";
import * as argon2 from 'argon2';
export const register = async (req: Request, res: Response, ):Promise<void> => {
	const validate = ZodValidate(CreateUserSchema, req, res);
	if(!validate) {
		res.status(400).json({message: 'Bad request'});
		return;
	}
	
	const user = await prisma.user.findUnique({where: {email: req.body.email}});
	if(user) {
		res.status(400).json({message: 'User already exists'});
		return;
	}
	
	const {email, password} = req.body;
	const new_user = await prisma.user.create({
		data: {
			email,
			password: await argon2.hash(password),
		}
	})
	
	const {token, refresh_token} = createPairTokens(req, res, new_user.id)
	saveTokens(res, {token, refresh_token})
	
	const {password:user_password, createdAt, updatedAt, ...user_without_password} = new_user;
	res.status(201).json({user: user_without_password})
	return;
}

export const login = async (req: Request, res: Response):Promise<void> => {
	const validate = ZodValidate(LoginUserSchema, req, res);
	if(!validate) {
		res.status(400).json({message: 'Bad request'});
		return
	}
	const {email, password} = req.body;
	const user = await prisma.user.findUnique({where: {email}});
	if(!user) {
		res.status(400).json({message: 'User not found'});
		return
	}
	const result = await argon2.verify(user.password, password);
	if(!result) {
		res.status(400).json({message: 'Bad password'});
		return
	}
	const {token, refresh_token} = createPairTokens(req, res, user.id)
	saveTokens(res, {token, refresh_token})
	const {password:user_password, createdAt, updatedAt, ...user_without_password} = user;
	res.status(200).json({user: user_without_password})
}