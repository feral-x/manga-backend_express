import express, {NextFunction} from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import router from "./router/router";
import * as config from "dotenv"
import {Request, Response} from "express";
config.config()


const app = express();
app.use(cookieParser());
app.use(cors({
	credentials: true,
}))
app.use(express.json())

app.use((err:any, req: Request, res: Response, next:NextFunction) => {
	console.log(err)
	res.status(500).json({
		message: 'Internal server error',
	})
	return;
})

app.use("/api", router);

app.listen(process.env.PORT || 3000, () => {
	console.log('Server listening on port 3000')
})