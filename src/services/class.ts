import prisma from "../lib/prisma.ts";

export async function getGroups() {
	return await prisma.kelas.findMany({

	})
}
