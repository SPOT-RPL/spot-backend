import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import type { Pengguna } from "../../generated/prisma/client";

const SALT_ROUNDS = 12;

export async function getPengguna(email: string): Promise<Pengguna | null> {
	return await prisma.pengguna.findUnique({ where: { email: email } });
}

export async function changePenggunaPassword(UUID: string, newPassword: string): Promise<boolean> {
	const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
	const changedRows: number = (await prisma.pengguna.updateMany({
		where: { UUID: UUID },
		data: { password: hashedPassword }
	})).count

	return changedRows > 0;
}
