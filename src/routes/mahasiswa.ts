import express, { type Request, type Response } from "express";
import { gabungKelompok, getAllMataKuliah, getAllTubesMatakuliah, getAnggotaKelompok, getJadwalMatakuliahMahasiswa, getJadwalUjianMahasiswa, getKelasMatakuliah, getKelompok, getMatakuliahYangDiambil, simpanMatakuliah } from "../services/mahasiswa";

const router = express.Router();

router.get("/matakuliah", async (_req: Request, res: Response) => {
    res.json(await getAllMataKuliah());
});

router.get("/matakuliahDiambil", async (req: Request, res: Response) => {
    const npm = req.query.npm as string;
    res.json(await getMatakuliahYangDiambil(npm));
});

router.get("/kelasMatakuliah", async (req: Request, res: Response) => {
    const kodeMk = req.query.kode_mk as string;
    res.json(await getKelasMatakuliah(kodeMk));
});

router.post("/simpanMatakuliah", async (req: Request, res: Response) => {
    const { npm, idKelas } = req.body;
    res.json(await simpanMatakuliah(npm, idKelas));
});

router.get("/kelompok", async (req: Request, res: Response) => {
    const { namaMatakuliah, namaKelas } = req.query;
    res.json(await getKelompok(namaMatakuliah as string, namaKelas as string));
});

router.get("/anggotaKelompok", async (req: Request, res: Response) => {
    const idKelompok = Number(req.query.idKelompok);
    res.json(await getAnggotaKelompok(idKelompok));
});

router.post("/gabungKelompok", async (req: Request, res: Response) => {
    const { npm, idKelompok } = req.body;
    res.json(await gabungKelompok(npm, idKelompok));
});

router.get("/jadwalKuliah", async (req: Request, res: Response) => {
    const npm = req.query.npm as string;
    res.json(await getJadwalMatakuliahMahasiswa(npm));
});

router.get("/jadwalUjian", async (req: Request, res: Response) => {
    const npm = req.query.npm as string;
    res.json(await getJadwalUjianMahasiswa(npm));
});

router.get("/tugasBesar", async (req: Request, res: Response) => {
    const npm = req.query.npm as string;
    res.json(await getAllTubesMatakuliah(npm));
});


export default router;  
