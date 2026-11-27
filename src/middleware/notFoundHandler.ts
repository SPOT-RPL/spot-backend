import { type RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (req, res, _next) => {
	return res.status(404).json({
		message: `Cannot ${req.method} ${req.originalUrl}`
	})
};
