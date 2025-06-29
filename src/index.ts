import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import router from "./router/router";
import * as config from "dotenv"

config.config()


const app = express();
app.use(cookieParser());
app.use(cors({
	credentials: true,
}))

app.use(express.json())

app.use(router)

app.listen(process.env.PORT || 3000, () => {
	console.log('Server listening on port 3000')
})