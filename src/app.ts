import express, { type Express, type Request, type Response } from "express";
import mahasiswaController from "./controllers/mahasiswa.controller.ts"

const app: Express = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.send("Database is Running!");
})

app.use("/api/mahasiswa", mahasiswaController)


export default app;
