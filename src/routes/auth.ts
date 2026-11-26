import express, { type Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { getPengguna, changePenggunaPassword } from "../services/pengguna";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { protect } from "../middleware/protect";
import { deleteRefreshToken, findActiveRefreshToken, registerRefreshToken } from "../services/refreshToken";

const router: Router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await getPengguna(email);

	if (!user || !await bcrypt.compare(password, user?.password)) {
		return res.status(401).json({
			message: "Invalid email or password"
		});
	}

	const accessToken = await generateAccessToken(user.UUID);
	const refreshToken = await generateRefreshToken(user.UUID);

	if (!await registerRefreshToken(refreshToken)) {
		return res.status(500).json({
			message: "Failed to store refresh token"
		});
	}

	return res.status(200).json({
		accessToken: accessToken,
		refreshToken: refreshToken
	});
})

router.post("/refresh", async (req: Request, res: Response) => {
	try {
		const { refreshToken } = req.body;
		const payload = await verifyRefreshToken(refreshToken);
		const userUUID = payload.sub;

		const foundRefreshToken = await findActiveRefreshToken(refreshToken)
		if (!foundRefreshToken || foundRefreshToken.userUUID !== userUUID) {
			return res.status(401).json({
				message: "Invalid or expired refresh token"
			});
		}

		if (! await deleteRefreshToken(foundRefreshToken)) {
			return res.status(500).json({
				message: "Failed to remove refresh token"
			});
		}

		const newAccessToken = await generateAccessToken(userUUID);
		const newRefreshToken = await generateRefreshToken(userUUID);

		if (!registerRefreshToken(newRefreshToken)) {
			return res.status(500).json({
				message: "Failed to store refresh token"
			});
		}

		return res.status(200).json({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken
		});
	} catch {
		return res.status(401).json({
			message: "Invalid refresh token"
		});
	}
})

router.post("/change-password", protect, async (req: Request, res: Response) => {
	const UUID = req.UUID!;
	const { password } = req.body;

	if (await changePenggunaPassword(UUID, password)) {
		return res.sendStatus(204);
	} else {
		return res.sendStatus(404);
	}
})

export default router;
