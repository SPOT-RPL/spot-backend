import express, { type Request, type Response } from "express";
import { protect } from "../middleware/protect";
import { getRole } from "../services/me";

const router = express.Router();

router.get("/", protect, async (req: Request, res: Response) => {
	const role = await getRole(req.UUID!);

	if (role) {
		return res.status(200).json({
			role: role
		});
	}

	return res.status(401).json({
		message: "Not authorized"
	})
})

export default router;
