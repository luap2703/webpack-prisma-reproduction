"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
module.exports.handler = async (event) => {
    console.log("event", event);
    try {
        const prisma = new client_1.PrismaClient();
        const x = await prisma.user.count();
        console.log(x);
    }
    catch (error) {
        console.log(error);
    }
};
//# sourceMappingURL=testFunction.js.map