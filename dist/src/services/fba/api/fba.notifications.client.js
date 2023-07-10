"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const selling_partner_api_sdk_1 = require("@scaleleap/selling-partner-api-sdk");
const lodash_1 = __importDefault(require("lodash"));
const main_controller_1 = require("../../../controllers/main.controller");
const log_error_1 = require("../../../error/log-error");
const fba_auth_1 = __importDefault(require("../auth/fba.auth"));
const { chunk } = lodash_1.default;
class FbaNotificationsController {
    static setupNotifications = async ({ user, notificationType, }) => {
        const params = await fba_auth_1.default.getApiParams(user);
        const client = new selling_partner_api_sdk_1.NotificationsApiClient(params);
        const destinationId = process.env.NOTIFICATION_DESTINATION;
        const existingSubscription = await main_controller_1.prisma.amazonNotificationSubscription.findUnique({
            where: {
                company_id_notificationType: {
                    company_id: user.company_id,
                    notificationType,
                },
            },
        });
        if (existingSubscription) {
            log_error_1.rollbar.info("Subscription already exists", existingSubscription);
            return existingSubscription;
        }
        const request = await client.createSubscription({
            body: {
                payloadVersion: "1.0",
                destinationId: destinationId,
            },
            notificationType,
        });
        const subscription = await main_controller_1.prisma.amazonNotificationSubscription.create({
            data: {
                subscriptionId: request.data.payload?.subscriptionId,
                company_id: user.company_id,
                destinationId: destinationId,
                api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                notificationType,
            },
        });
        log_error_1.rollbar.info("Subscription created", subscription);
        return subscription;
    };
}
exports.default = FbaNotificationsController;
//# sourceMappingURL=fba.notifications.client.js.map