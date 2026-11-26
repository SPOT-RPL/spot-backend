
import express from "express";

import { getStatistikAdmin, getAktivitasTerakhir, getJadwalPresentasi, getAllAkunMahasiswa, tambahMahasiswa, getMatakuliahYangDiambil, editMahasiswa, getAllAkunDosen, tambahDosen, getMatakuliahYangDiajar, editDosen, gantiDosenPengampu, tambahMatakuliah, editMatakuliah, getAllAktivitasPengguna } from "../services/admin";

const router = express.Router();


//halaman dashboard
router.get("/statistik", async (req, res) => {
    res.json(await getStatistikAdmin());
});

router.get("/aktivitasTerakhir", async (req, res) => {
    res.json(await getAktivitasTerakhir());
});

router.get("/jadwalPresentasi", async (req, res) => {
    res.json(await getJadwalPresentasi());
});


//halaman manajemen mahasiswa
router.get("/mahasiswa", async (req, res) => {
    res.json(await getAllAkunMahasiswa());
});

router.post("/tambahMahasiswa", async (req, res) => {
    const { nama_lengkap, npm, email } = req.body;
    res.json(await tambahMahasiswa(nama_lengkap, npm, email));
});

router.get("/matakuliahMahasiswa", async (req, res) => {
    const npm = req.query.npm as string;
    res.json(await getMatakuliahYangDiambil(npm));
});

router.put("/editMahasiswa/:npmLama", async (req, res) => {
    const npmLama = req.params.npmLama as string;
    const { nama_lengkap, npmBaru, email, statusPengguna, idKelasDihapus } = req.body;
    res.json(await editMahasiswa(nama_lengkap, npmBaru, npmLama, email, statusPengguna, idKelasDihapus));
});


//halaman manajemen dosen
router.get("/dosen", async (req, res) => {
    res.json(await getAllAkunDosen());
});

router.post("/tambahDosen", async (req, res) => {
    const { nama_lengkap, nidn, email } = req.body;
    res.json(await tambahDosen(nama_lengkap, nidn, email));
});

router.get("/matakuliahDosen", async (req, res) => {
    const nidn = req.query.nidn as string;
    res.json(await getMatakuliahYangDiajar(nidn));
});

router.put("/editDosen/:nidnLama", async (req, res) => {
    const nidnLama = req.params.nidnLama as string;
    const { nama_lengkap, nidnBaru, email, statusPengguna } = req.body;
    res.json(await editDosen(nama_lengkap, nidnBaru, nidnLama, email, statusPengguna));
});

router.put("/gantiDosenPengampu", async (req, res) => {
    const { idKelas, nidnDosenBaru } = req.body;
    res.json(await gantiDosenPengampu(idKelas, nidnDosenBaru));
});


//halaman manajemen matakuliah
router.post("/tambahMatakuliah", async (req, res) => {
    const { kodeMk, namaMk, namaKelas, nidn } = req.body;

    res.json(await tambahMatakuliah(kodeMk, namaMk, namaKelas, nidn));
});

router.put("/editMatakuliah/:kodeMk", async (req, res) => {
    const kodeMk = req.params.kodeMk as string;
    const { namaMkBaru, idKelas, namaKelasBaru } = req.body;

    res.json(await editMatakuliah(kodeMk, namaMkBaru, idKelas, namaKelasBaru));
});


//halaman aktivitas pengguna

router.get("/aktivitasPengguna", async (req, res) => {
    res.json(await getAllAktivitasPengguna());
});

export default router;
