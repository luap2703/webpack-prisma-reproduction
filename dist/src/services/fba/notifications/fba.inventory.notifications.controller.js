"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const selling_partner_api_sdk_1 = require("@scaleleap/selling-partner-api-sdk");
const main_controller_1 = require("../../../controllers/main.controller");
const tasks_controller_1 = __importDefault(require("../../../controllers/tasks.controller"));
const log_error_1 = require("../../../error/log-error");
const jtl_fulfillment_1 = __importDefault(require("../../jtl-fulfillment/jtl-fulfillment"));
const fba_products_client_1 = __importDefault(require("../api/fba.products.client"));
const fba_reports_client_1 = __importDefault(require("../api/fba.reports.client"));
const fba_auth_1 = __importDefault(require("../auth/fba.auth"));
class FbaInventoryNotificationsController {
    static updateInventory = async (data) => {
        try {
            if (!data.Payload) {
                log_error_1.rollbar.error("No payload", data);
                return;
            }
            const sellerId = data.Payload.SellerId;
            const api_connection = await main_controller_1.prisma.apiConnection.findUnique({
                where: {
                    api_username_api_provider: {
                        api_username: sellerId,
                        api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                    },
                },
            });
            if (!api_connection?.company_id) {
                log_error_1.rollbar.error("No company_id", data);
                return;
            }
            const amazonProducts = await main_controller_1.prisma.amazonProduct.findMany({
                where: {
                    owner_id: api_connection.company_id,
                    asin: data.Payload.ASIN,
                },
                select: {
                    sellerSku: true,
                    asin: true,
                    jtl_sku: true,
                },
            });
            if (!amazonProducts?.length) {
                log_error_1.rollbar.error("No SKU found to change inventory", data.Payload.SKU);
                return;
            }
            const DE = fba_auth_1.default.getMarketplace;
            const DEInventory = data.Payload.FulfillmentInventoryByMarketplace.filter((inventory) => inventory.MarketplaceId === DE.id)?.[0];
            if (!DEInventory) {
                log_error_1.rollbar.error("No DEInventory");
                return;
            }
            const client = new selling_partner_api_sdk_1.FbaInventoryApiClient(await fba_auth_1.default.getApiParams({
                company_id: api_connection.company_id,
            }));
            const updatedProducts = await fba_products_client_1.default.getInventorySummaries({
                user: {
                    company_id: api_connection.company_id,
                },
                products: amazonProducts.map((product) => {
                    return {
                        ...product,
                        sku: product.sellerSku,
                    };
                }),
                apiParams: await fba_auth_1.default.getApiParams({
                    company_id: api_connection.company_id,
                }),
                token: api_connection.access_token,
                marketplaces: [DE],
            });
            await jtl_fulfillment_1.default.getJtlStocks({
                user: {
                    company_id: api_connection.company_id,
                },
                products: amazonProducts
                    .filter((p) => !!p.jtl_sku)
                    .map((product) => {
                    return {
                        merchantSku: product.jtl_sku,
                    };
                }),
            });
            await this.updateReports(api_connection);
        }
        catch (error) {
            log_error_1.rollbar.error("ERROR WHEN UPDATING INVENTORY", error);
        }
    };
    static updateReports = async (user) => {
        try {
            const recentXMLAllOrdersReport = await main_controller_1.prisma.amazonReport.findFirst({
                where: {
                    reportType: client_1.AmazonReportType.GET_XML_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL,
                    dataEndTime: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                    status: {
                        not: {
                            in: [
                                client_1.AmazonReportStatus.PROCESSING_ERROR,
                                client_1.AmazonReportStatus.ERROR,
                            ],
                        },
                    },
                    api_connection: {
                        company_id: user.company_id,
                    },
                },
            });
            if (!recentXMLAllOrdersReport) {
                const allOrdersReportId = await fba_reports_client_1.default.createReport({
                    user,
                    reportType: client_1.AmazonReportType.GET_XML_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL,
                    dataStartTime: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
                    dataEndTime: new Date(),
                });
                console.log("Creating new all orders report as there was none/only old", allOrdersReportId);
                await tasks_controller_1.default.upsertTask({
                    user,
                    task: {
                        title: "FBA Synchronization",
                        status: client_1.TaskStatus.RUNNING,
                        events: {
                            create: [
                                {
                                    title: "Requested all orders reports",
                                    description: `Requested orders of the past 30 days`,
                                },
                            ],
                        },
                    },
                    filter: {
                        status: client_1.TaskStatus.RUNNING,
                    },
                });
            }
            const recentPlanningReport = await main_controller_1.prisma.amazonReport.findFirst({
                where: {
                    reportType: client_1.AmazonReportType.GET_FBA_INVENTORY_PLANNING_DATA,
                    created_at: {
                        gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                    },
                    status: {
                        not: {
                            in: [
                                client_1.AmazonReportStatus.PROCESSING_ERROR,
                                client_1.AmazonReportStatus.ERROR,
                            ],
                        },
                    },
                    api_connection: {
                        company_id: user.company_id,
                    },
                },
            });
            if (!recentPlanningReport) {
                const planningReportId = await fba_reports_client_1.default.createReport({
                    user,
                    reportType: client_1.AmazonReportType.GET_FBA_INVENTORY_PLANNING_DATA,
                });
                console.log("Creating new planning report as there was none/only old", planningReportId);
                await tasks_controller_1.default.upsertTask({
                    user,
                    task: {
                        title: "FBA Synchronization",
                        status: client_1.TaskStatus.RUNNING,
                        events: {
                            create: [
                                {
                                    title: "Requested inventory reports",
                                    description: `Requested orders of the past 30 days & inventory planning report`,
                                },
                            ],
                        },
                    },
                    filter: {
                        status: client_1.TaskStatus.RUNNING,
                    },
                });
            }
        }
        catch (error) {
            log_error_1.rollbar.log("Error in updatingReports", error.message);
            return;
        }
    };
}
exports.default = FbaInventoryNotificationsController;
//# sourceMappingURL=fba.inventory.notifications.controller.js.map