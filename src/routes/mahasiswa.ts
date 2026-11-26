import { Router } from "express";
import { getAllMataKuliah } from "../services/mahasiswa";

const router = Router();

router.get("/", async (req, res) => {
    res.json(await getAllMataKuliah());
});

export default router;
