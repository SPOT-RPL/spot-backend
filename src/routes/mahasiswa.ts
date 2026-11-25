import express, { type Router, type Request, type Response } from "express";
import { gabungKelompok, getAllMataKuliah, getAllTubesMatakuliah, getAnggotaKelompok, getJadwalMatakuliahMahasiswa, getJadwalUjianMahasiswa, getKelasMatakuliah, getKelompok, getMatakuliahYangDiambil, simpanMatakuliah } from "../services/mahasiswa";

const router = express.Router();

router.get("/matakuliah", async (req, res) => {
    res.json(await getAllMataKuliah());
});

router.get("/matakuliahDiambil", async (req, res) => {
    const npm = req.query.npm as string;
    res.json(await getMatakuliahYangDiambil(npm));
});

router.get("/kelasMatakuliah", async (req, res) => {
    const kodeMk = req.query.kode_mk as string;
    res.json(await getKelasMatakuliah(kodeMk));
});

router.post("/simpanMatakuliah", async (req, res) => {
    const { npm, idKelas } = req.body;
    res.json(await simpanMatakuliah(npm, idKelas));
});

router.get("/kelompok", async (req, res) => {
    const { namaMatakuliah, namaKelas } = req.query;
    res.json(await getKelompok(namaMatakuliah as string, namaKelas as string));
});

router.get("/anggotaKelompok", async (req, res) => {
    const idKelompok = Number(req.query.idKelompok);
    res.json(await getAnggotaKelompok(idKelompok));
});

router.post("/gabungKelompok", async (req, res) => {
    const { npm, idKelompok } = req.body;
    res.json(await gabungKelompok(npm, idKelompok));
});

router.get("/jadwalKuliah", async (req, res) => {
    const npm = req.query.npm as string;
    res.json(await getJadwalMatakuliahMahasiswa(npm));
});

router.get("/jadwalUjian", async (req, res) => {
    const npm = req.query.npm as string;
    res.json(await getJadwalUjianMahasiswa(npm));
});

router.get("/tugasBesar", async (req, res) => {
    const npm = req.query.npm as string;
    res.json(await getAllTubesMatakuliah(npm));
});


export default router;  