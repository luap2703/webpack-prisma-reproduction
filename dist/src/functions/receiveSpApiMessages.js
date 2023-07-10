"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = require("@controllers/main.controller");
const fba_reports_notifications_controller_1 = __importDefault(require("@fba/notifications/fba.reports.notifications.controller"));
const log_error_1 = require("src/error/log-error");
const fba_inventory_notifications_controller_1 = __importDefault(require("src/services/fba/notifications/fba.inventory.notifications.controller"));
const io_1 = require("src/services/socket/io");
module.exports.handler = async (event) => {
    try {
        const message = event.Records[0];
        console.log("Message", message);
        if (!message.body) {
            console.error("No body");
            return;
        }
        let body = message.body;
        if (typeof message.body === "string") {
            body = JSON.parse(message.body);
        }
        const payload = body.payload ?? body.Payload;
        if (!payload) {
            console.error("No payload", body);
            return;
        }
        const notificationType = body.notificationType ?? body.NotificationType;
        if (!notificationType) {
            console.error("No notificationType", body);
            return;
        }
        await main_controller_1.prisma.$connect();
        await io_1.redisClient.connect().catch((error) => {
            log_error_1.rollbar.error("CANT CONNECT TO REDIS", error);
        });
        if (notificationType === "REPORT_PROCESSING_FINISHED") {
            const controller = await fba_reports_notifications_controller_1.default.handleReportNotification(body);
        }
        if (notificationType === "FBA_INVENTORY_AVAILABILITY_CHANGES") {
            await fba_inventory_notifications_controller_1.default.updateInventory(body);
        }
        await io_1.redisClient.disconnect();
    }
    catch (error) {
        log_error_1.rollbar.error(error);
        await io_1.redisClient.disconnect();
        return Promise.reject(error);
    }
};
//# sourceMappingURL=receiveSpApiMessages.js.map