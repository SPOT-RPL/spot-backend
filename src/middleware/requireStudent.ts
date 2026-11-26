import type { RequestHandler } from "express";
import { getStudent } from "../services/mahasiswa";

export const requireStudent: RequestHandler = async (req, res, next) => {
	try {
		const student = await getStudent(req.UUID!);

		if (!student){
			return res.status(404).json({ message: "Student not found" });
		}

		req.student = student;

		next();
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
}
