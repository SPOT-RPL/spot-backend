import { type RequestHandler } from "express";
import { verifyAccessToken } from "../lib/jwt";

export const protect: RequestHandler = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			return res.status(401).json({ error: "Not authorized" });
		}

		const accessToken = authHeader.slice(7).trim();

		if (!accessToken) {
			return res.status(401).json({
				message: "Not authorized"
			})
		}

		const decoded = await verifyAccessToken(accessToken);

		req.UUID = decoded.sub;

		next();
	} catch (error) {
		res.status(401).json({ error: "Not authorized" });
	}
};
