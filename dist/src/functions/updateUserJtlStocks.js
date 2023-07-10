"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_error_1 = require("src/error/log-error");
const jtl_fulfillment_1 = __importDefault(require("src/services/jtl-fulfillment/jtl-fulfillment"));
const io_1 = require("src/services/socket/io");
module.exports.handler = async (user) => {
    try {
        if (!user.company_id) {
            await io_1.redisClient.connect().catch((error) => {
                log_error_1.rollbar.error("CANT CONNECT TO REDIS", error);
            });
            await jtl_fulfillment_1.default.getJtlRecentStockUpdates(user);
        }
        else {
            throw new Error("No company id provided");
        }
    }
    catch (error) {
        log_error_1.rollbar.error(error);
        return Promise.reject(error);
    }
};
//# sourceMappingURL=updateUserJtlStocks.js.map