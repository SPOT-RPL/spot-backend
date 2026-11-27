import { type Request, type Response, type NextFunction } from "express";

export const errorHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) {
		return next(err);
	}

	console.error(err);
	return res.status(500).json({
		message: "Internal server error"
	})
}
