import express, { type Request, type Response } from "express";
import { protect } from "../middleware/protect";
import { getUser, getUserRole } from "../services/me";

const router = express.Router();

router.get("/", protect, async (req: Request, res: Response) => {
	const role = await getUserRole(req.UUID!);
	if (!role) {
		return res.status(401).json({
			message: "Not authorized"
		})
	}


	const user = await getUser(req.UUID!);
	let roleObj;

	if ("npm" in role) {
		roleObj = {
			role: "student",
			npm: role.npm
		}
	}
	if ("nidn" in role) {
		roleObj = {
			role: "teacher",
			nidn: role.nidn
		}
	}
	if ("id_admin" in role) {
		roleObj = {
			role: "admin",
			adminId: role.id_admin
		}
	}

	return res.status(200).json({
		email: user!.email,
		fullName: user!.nama_lengkap,
		status: user!.status,
		...roleObj
	});
})

export default router;
