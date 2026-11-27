
import express, { type Request, type Response } from "express";
import { getStatistikAdmin, getAktivitasTerakhir, getJadwalPresentasi, getAllAkunMahasiswa, tambahMahasiswa, editMahasiswa, getAllAkunDosen, tambahDosen, editDosen, gantiDosenPengampu, tambahMatakuliah, editMatakuliah, getAllAktivitasPengguna, cekMahasiswa, detailMahasiswa, detailDosen, cekDosen, detailMatakuliah } from "../services/admin";
import { protect } from "../middleware/protect"
import prisma from "../lib/prisma";
import { getAllCourses } from "../services/mahasiswa";

const router = express.Router();


//halaman dashboard
router.get("/statistics", protect, async (req: Request, res: Response) => {
    try {
        res.status(200).json(await getStatistikAdmin());
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/latest-activity", protect, async (req: Request, res: Response) => {
    try {
        res.status(200).json(await getAktivitasTerakhir());
    } catch {
        res.status(500).json({ message: "Internal server error" })
    }
});

router.get("/presentation-schedule", protect, async (req: Request, res: Response) => {
    try {
        res.status(200).json(await getJadwalPresentasi())
    } catch {
        res.status(500).json({ message: "Internal server error" })
    }
});

//halaman manajemen mahasiswa
router.get("/student", protect, async (req: Request, res: Response) => {
    try {
        res.status(200).json(await getAllAkunMahasiswa());
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/addStudent", protect, async (req: Request, res: Response) => {
    try {
        const { nama_lengkap, npm, email } = req.body;

        if (!nama_lengkap || !npm || !email) {
            return res.status(400).json({ message: "All fields are required" })
        };

        if (await cekMahasiswa(npm, email)) {
            return res.status(409).json({ message: "Email or NPM already exist" })
        };

        const data = res.json(await tambahMahasiswa(nama_lengkap, npm, email));
        return res.status(201).json(data)
    } catch {
        return res.status(500).json({ message: "Internal server error" })
    }
});

router.get("/student/:npm", protect, async (req: Request, res: Response) => {
    try {
        const npm = req.params.npm as string;
        const mahasiswa = await detailMahasiswa(npm);

        if (!mahasiswa) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json(mahasiswa);
    } catch {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.put("/student/:npm", protect, async (req: Request, res: Response) => {
    try {
        const npmLama = req.params.npm as string;

        const { nama_lengkap, npmBaru, email, statusPengguna, idKelasDihapus } = req.body;

        if (!nama_lengkap || !npmBaru || !email || !statusPengguna) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const mahasiswa = await detailMahasiswa(npmLama);

        if (!mahasiswa) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json(
            await editMahasiswa(nama_lengkap, npmBaru, npmLama, email, statusPengguna, idKelasDihapus ?? []));

    } catch {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

//halaman manajemen dosen
router.get("/lecturer", protect, async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await getAllAkunDosen());
    } catch {
        return res.status(500).json({ message: "Internal server error" })
    }
});

router.post("/add-lecturer", protect, async (req: Request, res: Response) => {
    try {
        const { nama_lengkap, nidn, email } = req.body;

        if (!nama_lengkap || !nidn || !email) {
            return res.status(400).json({ message: "All fields is required" })
        }

        if (await cekDosen(nidn)) {
            return res.status(409).json({ message: "Email or NIDN already exists" })
        }

        const data = await tambahDosen(nama_lengkap, nidn, email);
        return res.status(200).json(data);
    } catch {
        return res.status(500).json({ message: "Internal server error" })
    }
});

router.get("/dosen/:nidn", protect, async (req: Request, res: Response) => {
    try {
        const nidn = req.params.nidn as string;
        const dosen = await detailDosen(nidn);

        if (!dosen) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        return res.status(200).json(dosen);

    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/dosen/:nidn", protect, async (req: Request, res: Response) => {
    try {
        const nidnLama = req.params.nidn as string;

        const { nama_lengkap, nidnBaru, email, statusPengguna } = req.body;

        if (!nama_lengkap || !nidnBaru || !email || !statusPengguna) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const dosen = await detailDosen(nidnLama);

        if (!dosen) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        return res.status(200).json(
            await editDosen(nama_lengkap, nidnBaru, nidnLama, email, statusPengguna)
        );

    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/gantiDosenPengampu", protect, async (req: Request, res: Response) => {
    const { idKelas, nidnDosenBaru } = req.body;
    res.json(await gantiDosenPengampu(idKelas, nidnDosenBaru));
});


//halaman manajemen matakuliah
router.get("/courses", protect, async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await getAllCourses);
    } catch {
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.post("/courses", protect, async (req: Request, res: Response) => {
    try {
        const { kodeMk, namaMk, namaKelas, nidn } = req.body;

        if (!kodeMk || !namaMk || !namaKelas || !nidn) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (await detailMatakuliah(kodeMk)) {
            return res.status(409).json({ message: "Course already exists" });
        }

        if (!await cekDosen(nidn)) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        const data = await tambahMatakuliah(kodeMk, namaMk, namaKelas, nidn);
        return res.status(201).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/courses/:kodeMk", protect, async (req: Request, res: Response) => {
    try {
        const kodeMk = req.params.kodeMk as string;
        const course = await detailMatakuliah(kodeMk);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json(course);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//halaman aktivitas pengguna
router.get("/aktivitasPengguna", protect, async (req: Request, res: Response) => {
    try {
        return res.status(200).json(await getAllAktivitasPengguna());
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
export default router;