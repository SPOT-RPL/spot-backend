import prisma from "../lib/prisma";

export async function getUser(userUUID: string) {
	return await prisma.pengguna.findUnique({ where: { UUID: userUUID } });
}

export async function getUserRole(userUUID: string) {
	const student = await prisma.mahasiswa.findUnique({ where: { UUID: userUUID }});
	if (student) {
		return student;
	}

	const teacher = await prisma.dosen.findUnique({ where: { UUID: userUUID }});
	if (teacher) {
		return teacher;
	}

	const admin = await prisma.admin.findUnique({ where: { UUID: userUUID }});
	if (admin) {
		return admin;
	}
}
