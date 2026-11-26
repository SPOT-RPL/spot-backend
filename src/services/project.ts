import prisma from "../lib/prisma.ts";

export async function getGroups(projectId: number) {
	return await prisma.tugasBesar.findMany({
		where: {
			id_tubes: projectId
		},
		include: {
			kelompok: {
				include: {
					jadwalPresentasi: true,
					anggotaKelompok: true
				}
			}
		}
	})
}
