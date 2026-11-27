import express, { type Request, type Response } from "express";
import { getGroups } from "../services/project";

const router = express.Router();

router.get("/:projectId/groups", async (req: Request, res: Response) => {
	const projectId = Number(req.params.projectId);

	if (!Number.isInteger(projectId) || projectId < 0) {
		return res.status(400).json({ message: "Invalid project id" });
	}

	try {
		res.status(200).json(await getGroups(projectId));
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
});

export default router;
