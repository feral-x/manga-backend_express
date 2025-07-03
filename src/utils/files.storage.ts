import multer, {Multer, StorageEngine} from "multer";
import { promises as fs } from 'fs';
import { join } from "path";

const folderPath = join(__dirname, "..", "uploads")


export const saveFiles = async (files: Express.Multer.File[]) => {
	const paths:string[] = [];
	try {
		await fs.access(folderPath);
		console.log(folderPath)
	} catch {
		await fs.mkdir(folderPath, { recursive: true });
	}
	for(let file of files) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const filePath =  uniqueSuffix + file.originalname;
		await fs.writeFile(join(folderPath, filePath), file.buffer)
		paths.push(uniqueSuffix);
	}
	return paths;
}



export const upload = multer({ storage: multer.memoryStorage() })