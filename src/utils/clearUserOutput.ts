import {User} from "@prisma/client";

export const ClearUserOutput = (user: User) => {
	const {password:user_password, createdAt, updatedAt, ...user_without_password} = user;
	return user_without_password;
}