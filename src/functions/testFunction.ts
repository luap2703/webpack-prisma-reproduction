import { PrismaClient } from "@prisma/client";

module.exports.handler = async (event: any) => {
  console.log("event", event);
  // Check if message.Body is a string or an object
  try {
    const prisma = new PrismaClient();
    const x = await prisma.user.count();

    console.log(x);
  } catch (error: any) {
    console.log(error);
  }
};
