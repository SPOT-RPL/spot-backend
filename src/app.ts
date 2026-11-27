import express, { type Express } from "express";
import health from "./routes/health.ts"
import auth from "./routes/auth.ts"
import student from "./routes/mahasiswa.ts"
import admin from "./routes/admin.ts"
import projects from "./routes/projects.ts"
import me from "./routes/me.ts"
import { errorHandler } from "./middleware/errorHandler.ts";
import { notFoundHandler } from "./middleware/notFoundHandler.ts";
import { logger } from "./middleware/logger.ts";

const app: Express = express();
app.use(express.json());

// Logging
app.use(logger);

// Routes
app.use("/api/health", health);
app.use("/api/auth", auth)
app.use("/api/student", student);
app.use("/api/admin", admin);
app.use("/api/projects", projects);
app.use("/api/me", me);

// Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
