import prisma from "../lib/prisma.ts";

export async function getAllMataKuliah() {
    return await prisma.matakuliah.findMany();
}
