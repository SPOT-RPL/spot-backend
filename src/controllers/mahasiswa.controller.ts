import { Router } from "express";
import type { Request, Response } from "express";
import { getAllMataKuliah } from "../services/mahasiswa.services";

const router = Router();

router.get("/matakuliah", async (req, res) => {
    const matakuliah = await getAllMataKuliah();
    res.json(matakuliah);
});

export default router;