import express, { type Request, type Response } from "express";
import { getAllCourses, getClassSchedule, getExamSchedule, getProjects, getTakenCourses, joinGroup, takeCourse } from "../services/mahasiswa";
import { protect } from "../middleware/protect"
import { requireStudent } from "../middleware/requireStudent";

const router = express.Router();

router.get("/courses", protect, requireStudent, async (req: Request, res: Response) => {
	const taken = (req.query.taken === "true");

	try {
		if (taken) {
			res.status(200).json(await getAllCourses());
		} else {
			res.status(200).json(await getTakenCourses(req.student!.npm));
		}
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/class-schedules", protect, requireStudent, async (req: Request, res: Response) => {
	try {
		return res.status(200).json(getClassSchedule(req.student!.npm));
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/exam-schedules", protect, requireStudent, async (req: Request, res: Response) => {
	try {
		return res.status(200).json(getExamSchedule(req.student!.npm));
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
})

router.get("/projects", protect, requireStudent, async (req: Request, res: Response) => {
	try {
		return res.status(200).json(getProjects(req.student!.npm));
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.post("/group/:groupId", protect, requireStudent, async (req: Request, res: Response) => {
	try {
		await joinGroup(req.student!.npm, Number(req.params.groupId));
		return res.sendStatus(201);
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.post("/course-taken", protect, requireStudent, async (req: Request, res: Response) => {
	try {
		const { classIds } = req.body;

		res.status(201).json(await takeCourse(req.student!.npm, classIds));
	} catch {
		res.status(500).json({ message: "Internal server error" })
	}
});


export default router;  
