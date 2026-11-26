import type { RefreshToken } from "../../generated/prisma/client";
import { verifyRefreshToken } from "../lib/jwt";
import prisma from "../lib/prisma";

function hashRefreshToken(refreshToken: string): string {
	return Bun.CryptoHasher.hash("sha256", refreshToken, "hex");
}

export async function registerRefreshToken(refreshToken: string): Promise<Boolean> {
	const payload = await verifyRefreshToken(refreshToken);
	try {
		await prisma.refreshToken.create({
			data: {
				userUUID: payload.sub,
				tokenHash: hashRefreshToken(refreshToken),
				expiresAt: new Date(payload.exp * 1000)
			}
		});
		return true;
	} catch {
		return false;
	}
}

export async function findActiveRefreshToken(refreshToken: string): Promise<RefreshToken | null> {
	return await prisma.refreshToken.findUnique({
		where: {
			tokenHash: hashRefreshToken(refreshToken),
			expiresAt: {
				gt: new Date()
			}
		}
	});
}

export async function deleteRefreshToken(refreshToken: RefreshToken): Promise<Boolean> {
	return (await prisma.refreshToken.deleteMany({
		where: {
			tokenHash: refreshToken.tokenHash
		}
	})).count > 0;
}
