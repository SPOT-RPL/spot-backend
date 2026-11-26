import express, { type Request, type Response } from "express";
import { protect } from "../middleware/protect"
import { gabungKelompok, getAllMataKuliah, getAllTubesMatakuliah, getClassSchedule, getExamSchedule, getMahasiswa, getMatakuliahYangDiambil, simpanMatakuliah } from "../services/mahasiswa";

const router = express.Router();

router.get("/courses", protect, async (_req: Request, res: Response) => {
	try {
		res.status(200).json(await getAllMataKuliah());
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/matakuliah-diambil", protect, async (req: Request, res: Response) => {
	try {
		const mahasiswa = await getMahasiswa(req.UUID!);

		if (!mahasiswa) {
			return res.status(404).json({ message: "Student not found" });
		}

		return res.status(200).json(await getMatakuliahYangDiambil(mahasiswa.npm));
	} catch {
		res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/class-schedules", protect, async (req: Request, res: Response) => {
	try {
		const student = await getMahasiswa(req.UUID!);

		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		return res.status(200).json(getClassSchedule(student.npm));
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/exam-schedules", protect, async (req: Request, res: Response) => {
	try {
		const student = await getMahasiswa(req.UUID!);

		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		return res.status(200).json(getExamSchedule(student.npm));
	} catch {
		return res.status(500).json({ message: "Internal server error" });
	}
})

router.get("/tugasBesar", async (req: Request, res: Response) => {
	const npm = req.query.npm as string;
	res.json(await getAllTubesMatakuliah(npm));
});

router.post("/gabungKelompok", async (req: Request, res: Response) => {
	const { npm, idKelompok } = req.body;
	res.json(await gabungKelompok(npm, idKelompok));
});

router.post("/pengambilan-matakuliah", protect, async (req: Request, res: Response) => {
	try {
		const { classIds } = req.body;
		const mahasiswa = await getMahasiswa(req.UUID!);

		if (!mahasiswa) {
			return res.status(404).json({ message: "Student not found" });
		}

		res.status(200).json(await simpanMatakuliah(mahasiswa.npm, classIds));
	} catch {
		res.status(500).json({ message: "Internal server error" })
	}
});


export default router;  
