import express, { type Express } from "express";
import health from "./routes/health.ts"
import auth from "./routes/auth.ts"
import mahasiswa from "./routes/mahasiswa.ts"
import admin from "./routes/admin.ts"
import me from "./routes/me.ts"

const app: Express = express();
app.use(express.json());

app.use("/api/health", health);
app.use("/api/auth", auth)
app.use("/api/mahasiswa", mahasiswa);
app.use("/api/admin", admin);
app.use("/api/me", me);

export default app;
