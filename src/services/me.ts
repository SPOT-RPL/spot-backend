import prisma from "../lib/prisma";

export async function getUser(userUUID: string) {
	return await prisma.pengguna.findUnique({ where: { UUID: userUUID } });
}

export async function getUserRole(userUUID: string) {
	const student = await prisma.student.findUnique({ where: { UUID: userUUID }});
	if (student) {
		return student;
	}

	const lecturer = await prisma.lecturer.findUnique({ where: { UUID: userUUID }});
	if (lecturer) {
		return lecturer;
	}

	const admin = await prisma.admin.findUnique({ where: { UUID: userUUID }});
	if (admin) {
		return admin;
	}
}
