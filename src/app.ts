import express, { type Express } from "express";
import health from "./routes/health.ts"
import auth from "./routes/auth.ts"

const app: Express = express();
app.use(express.json());

app.use("/health", health);
app.use("/auth", auth)


export default app;
