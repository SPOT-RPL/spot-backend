import express, { type Express } from "express";
import health from "./routes/health.ts"
import mahasiswa from "./routes/mahasiswa.ts"

const app: Express = express();
app.use(express.json());

app.use("/health", health);
app.use("/mahasiswa", mahasiswa);


export default app;
