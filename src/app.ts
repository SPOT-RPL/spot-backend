import express, { type Express } from "express";
import health from "./routes/health.ts"
import auth from "./routes/auth.ts"
import mahasiswa from "./routes/mahasiswa.ts"

const app: Express = express();
app.use(express.json());

app.use("/api/mahasiswa", mahasiswa);
app.use("/api/health", health);
app.use("/api/auth", auth)

export default app;
