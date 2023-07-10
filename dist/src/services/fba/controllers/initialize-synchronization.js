"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMYIAllUnsuppressedInventoryReport = void 0;
const main_controller_1 = require("@controllers/main.controller");
const tasks_controller_1 = __importDefault(require("@controllers/tasks.controller"));
const client_1 = require("@prisma/client");
const reports_api_model_1 = require("@scaleleap/selling-partner-api-sdk/lib/api-models/reports-api-model");
const fba_reports_client_1 = __importDefault(require("src/services/fba/api/fba.reports.client"));
const fba_products_client_1 = __importDefault(require("../api/fba.products.client"));
const fba_auth_1 = __importDefault(require("../auth/fba.auth"));
const fba_inventory_notifications_controller_1 = __importDefault(require("../notifications/fba.inventory.notifications.controller"));
const fba_reports_notifications_controller_1 = __importDefault(require("../notifications/fba.reports.notifications.controller"));
const handleMYIAllUnsuppressedInventoryReport = async (data) => {
    console.info("Received MYI Unsuppressed Inventory report", data.payload.reportProcessingFinishedNotification.sellerId.slice(-5));
    console.info("Initiating product import...");
    await fba_reports_notifications_controller_1.default.upsertReport({
        ...data.payload.reportProcessingFinishedNotification,
        status: client_1.AmazonReportStatus.RECEIVED,
    });
    const api_connection = await fba_reports_notifications_controller_1.default.getApiConnection(data);
    const token = api_connection.access_token;
    const doc = await fba_reports_client_1.default.getReportDocument({
        user: { company_id: api_connection?.company_id },
        reportDocumentId: data.payload.reportProcessingFinishedNotification.reportDocumentId,
        reportType: client_1.AmazonReportType.GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA,
    });
    try {
        const user = api_connection;
        const allMYIProducts = doc;
        const allInventoryReport = doc.map((row) => row.sku);
        const createdProducts = [];
        const transaction = await main_controller_1.prisma.$transaction(async (tx) => {
            await Promise.all(allMYIProducts.map(async (myiProduct) => {
                const product = await tx.amazonProduct.upsert({
                    where: {
                        owner_id_sellerSku: {
                            sellerSku: myiProduct.sku,
                            owner_id: api_connection?.company_id,
                        },
                    },
                    create: {
                        sellerSku: myiProduct.sku,
                        fnSku: myiProduct.fnsku,
                        asin: myiProduct.asin,
                        afnListingExists: myiProduct.afnListingExists === "Yes",
                        productName: myiProduct.productName,
                        condition: myiProduct.condition === "New"
                            ? client_1.AmazonProductCondition.NewItem
                            : client_1.AmazonProductCondition.Unknown,
                        owner_id: api_connection?.company_id,
                    },
                    update: {
                        sellerSku: myiProduct.sku,
                        fnSku: myiProduct.fnsku,
                        asin: myiProduct.asin,
                        afnListingExists: myiProduct.afnListingExists === "Yes",
                        productName: myiProduct.productName,
                        condition: myiProduct.condition === "New"
                            ? client_1.AmazonProductCondition.NewItem
                            : client_1.AmazonProductCondition.Unknown,
                        owner_id: api_connection?.company_id,
                    },
                });
                createdProducts.push(product);
                return product;
            }));
        }, {
            maxWait: 5_000,
            timeout: 10_000,
        });
        console.info(`Upsert ${createdProducts.length} products`);
        const inventorySummaries = await fba_products_client_1.default.getInventorySummaries({
            user,
            products: doc,
            token,
            apiParams: await fba_auth_1.default.getApiParams(user),
            marketplaces: [fba_auth_1.default.getMarketplace],
        });
        await tasks_controller_1.default.upsertTask({
            user,
            task: {
                title: "FBA Synchronization",
                status: client_1.TaskStatus.RUNNING,
                events: {
                    create: [
                        {
                            title: "Synced inventories",
                            description: `Synced ${createdProducts.length} inventories`,
                        },
                    ],
                },
            },
        });
        const catalogItems = await fba_products_client_1.default.getCatalogItems(user, createdProducts, {
            token,
            apiParams: await fba_auth_1.default.getApiParams(user),
            marketplaces: [fba_auth_1.default.getMarketplace],
        });
        const inboundEligibility = await fba_products_client_1.default.getInboundEligibilityPreviews({
            user,
            products: createdProducts,
        });
        await tasks_controller_1.default.upsertTask({
            user,
            task: {
                title: "FBA Synchronization",
                status: client_1.TaskStatus.RUNNING,
                events: {
                    create: [
                        {
                            title: "Synced catalog items",
                            description: `Synced ${createdProducts.length} catalog items`,
                        },
                    ],
                },
            },
        });
        const inventoryRecommendationsReportSchedule = await fba_reports_client_1.default.createReportSchedule({
            user,
            reportType: client_1.AmazonReportType.GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT,
            period: reports_api_model_1.CreateReportScheduleSpecificationPeriodEnum.Pt30M,
        });
        await fba_inventory_notifications_controller_1.default.updateReports(user);
        const finishedTask = await tasks_controller_1.default.upsertTask({
            user,
            task: {
                title: "FBA Synchronization",
                status: client_1.TaskStatus.DONE,
            },
            filter: {
                status: client_1.TaskStatus.RUNNING,
            },
        });
    }
    catch (error) {
        await fba_reports_notifications_controller_1.default.upsertReport({
            ...data.payload.reportProcessingFinishedNotification,
            status: client_1.AmazonReportStatus.PROCESSING_ERROR,
        });
    }
    await fba_reports_notifications_controller_1.default.upsertReport({
        ...data.payload.reportProcessingFinishedNotification,
        status: client_1.AmazonReportStatus.COMPLETED,
    });
};
exports.handleMYIAllUnsuppressedInventoryReport = handleMYIAllUnsuppressedInventoryReport;
//# sourceMappingURL=initialize-synchronization.js.map