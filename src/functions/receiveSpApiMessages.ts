import { PrismaClient } from "@prisma/client";

module.exports.handler = async (event: any) => {
  // Check if message.Body is a string or an object

  try {
    const prisma = new PrismaClient();
    await prisma.user.count();
  } catch (error: any) {}
};
