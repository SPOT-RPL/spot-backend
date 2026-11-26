import type { Admin, Dosen, Mahasiswa } from "../../generated/prisma/client";

declare global {
    namespace Express {
        interface Request {
            UUID?: string;
			role?: "student" | "teacher" | "admin";
			student?: Mahasiswa,
			teacher?: Dosen,
			admin?: Admin
        }
    }
}

export {};
