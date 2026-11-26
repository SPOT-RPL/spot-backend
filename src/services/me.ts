import prisma from "../lib/prisma";

type Role = "student" | "teacher" | "admin";

export async function getRole(userUUID: string): Promise<Role | undefined> {
	if (await prisma.mahasiswa.findUnique({ where: { UUID: userUUID }})) {
		return "student";
	}

	if (await prisma.dosen.findUnique({ where: { UUID: userUUID }})) {
		return "teacher";
	}

	if (await prisma.admin.findUnique({ where: { UUID: userUUID }})) {
		return "admin";
	}

	return undefined;
}
