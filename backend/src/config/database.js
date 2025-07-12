import { PrismaClient } from "@prisma/client";

// It's recommended to instantiate a single PrismaClient instance and re-use it across your application.
const prisma = new PrismaClient();

export default prisma;
