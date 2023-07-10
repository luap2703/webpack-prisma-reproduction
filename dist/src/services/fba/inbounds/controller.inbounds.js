"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = require("../../../controllers/main.controller");
class FbaInboundController {
    static startInboundProcess = async () => {
        const restockableProducts = await main_controller_1.prisma.amazonProduct.findMany({
            where: {
                jtl_product: {
                    isNot: null,
                },
            },
        });
    };
}
exports.default = FbaInboundController;
//# sourceMappingURL=controller.inbounds.js.map