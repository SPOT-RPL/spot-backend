import express, { type Router, type Request, type Response } from "express";
import prisma from "../lib/prisma.ts";

const router: Router = express.Router();

enum HealthStatus { Healthy = "healthy", Unhealthy = "unhealthy" }

interface HealthCheck {
	status: HealthStatus,
	latency_ms: number,
	error?: string
}

async function databaseCheck(): Promise<HealthCheck> {
	const start_ms = Date.now();

	try {
		await prisma.$queryRawUnsafe("SELECT 1");
		return {
			status: HealthStatus.Healthy,
			latency_ms: Date.now() - start_ms
		}
	} catch (error) {
		return {
			status: HealthStatus.Unhealthy,
			latency_ms: Date.now() - start_ms,
			error: error instanceof Error ? error.message : String(error)
		}
	}

}

router.get("/", async (_req: Request, res: Response) => {
	const databaseHealth = await databaseCheck();
	if (databaseHealth.status === HealthStatus.Healthy) {
		res.status(200).json(databaseHealth);
	} else {
		res.status(503).json(databaseHealth);
	}
})

export default router;
