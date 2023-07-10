"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePlanningReport = void 0;
const main_controller_1 = require("@controllers/main.controller");
const tasks_controller_1 = __importDefault(require("@controllers/tasks.controller"));
const client_1 = require("@prisma/client");
const log_error_1 = require("src/error/log-error");
const fba_reports_client_1 = __importDefault(require("src/services/fba/api/fba.reports.client"));
const calculation_inbounds_1 = __importDefault(require("src/services/fba/inbounds/calculation.inbounds"));
const fba_reports_notifications_controller_1 = __importDefault(require("src/services/fba/notifications/fba.reports.notifications.controller"));
const handlePlanningReport = async (data) => {
    try {
        fba_reports_notifications_controller_1.default.upsertReport({
            ...data.payload.reportProcessingFinishedNotification,
            status: client_1.AmazonReportStatus.RECEIVED,
        });
        const api_connection = await fba_reports_notifications_controller_1.default.getApiConnection(data);
        console.info("Received planning report", data.payload.reportProcessingFinishedNotification.sellerId.slice(-5));
        await tasks_controller_1.default.upsertTask({
            user: {
                company_id: api_connection.company_id,
            },
            task: {
                title: "FBA Synchronization",
                status: client_1.TaskStatus.RUNNING,
                events: {
                    create: [
                        {
                            title: "Received inventory planning report",
                            description: `Received inventory planning report`,
                            status: client_1.TaskStatus.RUNNING,
                        },
                    ],
                },
            },
            filter: {
                status: client_1.TaskStatus.RUNNING,
            },
        });
        const doc = (await fba_reports_client_1.default.getReportDocument({
            user: { company_id: api_connection?.company_id },
            reportDocumentId: data.payload.reportProcessingFinishedNotification.reportDocumentId,
            reportType: client_1.AmazonReportType.GET_FBA_INVENTORY_PLANNING_DATA,
        }));
        const productPlanningObjects = [];
        await Promise.all(doc.map(async (productPlanningObject) => {
            const params = {
                owner: {
                    connect: {
                        company_id: api_connection?.company_id,
                    },
                },
                amazon_product: {
                    connect: {
                        owner_id_sellerSku: {
                            owner_id: api_connection?.company_id,
                            sellerSku: productPlanningObject.sku,
                        },
                    },
                },
                snapshotDate: new Date(productPlanningObject.snapshotDate),
                available: productPlanningObject.available,
                pendingRemovalQuantity: productPlanningObject.pendingRemovalQuantity,
                invAge0To90Days: productPlanningObject.invAge0To90Days,
                invAge91To180Days: productPlanningObject.invAge91To180Days,
                invAge181To270Days: productPlanningObject.invAge181To270Days,
                invAge271To365Days: productPlanningObject.invAge271To365Days,
                invAge365PlusDays: productPlanningObject.invAge365PlusDays,
                currency: productPlanningObject.currency,
                unitsShippedT7: productPlanningObject.unitsShippedT7,
                unitsShippedT30: productPlanningObject.unitsShippedT30,
                unitsShippedT60: productPlanningObject.unitsShippedT60,
                unitsShippedT90: productPlanningObject.unitsShippedT90,
                yourPrice: productPlanningObject.yourPrice,
                salesPrice: productPlanningObject.salesPrice,
                lowestPriceNewPlusShipping: productPlanningObject.lowestPriceNewPlusShipping,
                lowestPriceUsed: productPlanningObject.lowestPriceUsed,
                recommendedAction: productPlanningObject.recommendedAction,
                healthyInventoryLevel: productPlanningObject.healthyInventoryLevel,
                recommendedSalesPrice: productPlanningObject.recommendedSalesPrice,
                recommendedSaleDurationDays: productPlanningObject.recommendedSaleDurationDays,
                recommendedRemovalQuantity: productPlanningObject.recommendedRemovalQuantity,
                estimatedCostSavingsOfRecommendedActions: productPlanningObject.estimatedCostSavingsOfRecommendedActions,
                sellThrough: productPlanningObject.sellThrough,
                itemVolume: productPlanningObject.itemVolume,
                volumeUnitMeasurement: productPlanningObject.volumeUnitMeasurement,
                storageType: productPlanningObject.storageType,
                storageVolume: productPlanningObject.storageVolume,
                marketplace: productPlanningObject.marketplace,
                productGroup: productPlanningObject.productGroup,
                salesRank: productPlanningObject.salesRank,
                daysOfSupply: productPlanningObject.daysOfSupply,
                estimatedExcessQuantity: productPlanningObject.estimatedExcessQuantity,
                weeksOfCoverT30: productPlanningObject.weeksOfCoverT30,
                weeksOfCoverT90: productPlanningObject.weeksOfCoverT90,
                featuredofferPrice: productPlanningObject.featuredofferPrice,
                salesShippedLast7Days: productPlanningObject.salesShippedLast7Days,
                salesShippedLast30Days: productPlanningObject.salesShippedLast30Days,
                salesShippedLast60Days: productPlanningObject.salesShippedLast60Days,
                salesShippedLast90Days: productPlanningObject.salesShippedLast90Days,
                invAge0To30Days: productPlanningObject.invAge0To30Days,
                invAge31To60Days: productPlanningObject.invAge31To60Days,
                invAge61To90Days: productPlanningObject.invAge61To90Days,
                invAge181To330Days: productPlanningObject.invAge181To330Days,
                invAge331To365Days: productPlanningObject.invAge331To365Days,
                estimatedStorageCostNextMonth: productPlanningObject.estimatedStorageCostNextMonth,
                inboundQuantity: productPlanningObject.inboundQuantity,
                inboundWorking: productPlanningObject.inboundWorking,
                inboundShipped: productPlanningObject.inboundShipped,
                inboundReceived: productPlanningObject.inboundReceived,
                reservedQuantity: productPlanningObject.reservedQuantity,
                unfulfillableQuantity: productPlanningObject.unfulfillableQuantity,
                alert: productPlanningObject.alert,
                report: productPlanningObject,
            };
            if (params.available === null) {
                return;
            }
            return await main_controller_1.prisma.$transaction(async (tx) => {
                try {
                    const planningData = await tx.amazonProductPlanningData.upsert({
                        where: {
                            owner_id_sellerSku: {
                                owner_id: api_connection?.company_id,
                                sellerSku: productPlanningObject.sku,
                            },
                        },
                        create: {
                            ...params,
                        },
                        update: {
                            ...params,
                        },
                    });
                    try {
                        const product = await calculation_inbounds_1.default.calculateUnitsShippedT({
                            owner_id: api_connection?.company_id,
                            sellerSku: productPlanningObject.sku,
                            planningData,
                            tx,
                        });
                    }
                    catch (error) {
                        console.log(error?.message);
                    }
                    productPlanningObjects.push(planningData);
                }
                catch (error) {
                    log_error_1.rollbar.error(error);
                }
            });
        }));
        await tasks_controller_1.default.upsertTask({
            user: {
                company_id: api_connection.company_id,
            },
            task: {
                title: "FBA Synchronization",
                status: client_1.TaskStatus.RUNNING,
                events: {
                    create: [
                        {
                            title: "Finished inventory planning report",
                            description: `We processed the inventory planning report`,
                            status: client_1.TaskStatus.DONE,
                        },
                    ],
                },
            },
            filter: {
                status: client_1.TaskStatus.RUNNING,
            },
        });
        await fba_reports_notifications_controller_1.default.upsertReport({
            ...data.payload.reportProcessingFinishedNotification,
            status: client_1.AmazonReportStatus.COMPLETED,
        });
    }
    catch (error) {
        await fba_reports_notifications_controller_1.default.upsertReport({
            ...data.payload.reportProcessingFinishedNotification,
            status: client_1.AmazonReportStatus.PROCESSING_ERROR,
        });
        log_error_1.rollbar.error("Failed to process inventory data", error);
    }
};
exports.handlePlanningReport = handlePlanningReport;
//# sourceMappingURL=get-historic-planning-data.js.map