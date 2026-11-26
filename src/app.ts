import express, { type Express } from "express";
import health from "./routes/health.ts"
import mahasiswa from "./routes/mahasiswa.ts"
import admin from "./routes/admin.ts"

const app: Express = express();
app.use(express.json());

app.use("/health", health);
app.use("/mahasiswa", mahasiswa);
app.use("/admin", admin);


export default app;
