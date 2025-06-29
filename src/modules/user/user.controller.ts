import {Request, Response} from "express";
import {prisma} from "../../prisma/prisma";
import {ClearUserOutput} from "../../utils/clearUserOutput";

export const GetProfile = async (req: Request, res: Response) => {
	const param_id = +req.params.id;
	const user = await prisma.user.findUnique({where: {id: param_id}});
	if(!user) {
		res.status(404).json({message: 'User not found'});
		return;
	}
	
	res.status(200).json({user: ClearUserOutput(user)})
}