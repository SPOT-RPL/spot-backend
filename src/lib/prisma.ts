import { PrismaPg    } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = Bun.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL tidak ditemukan");
}

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient ({adapter});

export default prisma;
