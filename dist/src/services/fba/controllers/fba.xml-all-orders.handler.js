"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAggregatedView = exports.handleXMLAllOrdersReport = void 0;
const main_controller_1 = require("@controllers/main.controller");
const tasks_controller_1 = __importDefault(require("@controllers/tasks.controller"));
const fba_reports_notifications_controller_1 = __importDefault(require("@fba/notifications/fba.reports.notifications.controller"));
const client_1 = require("@prisma/client");
const lodash_1 = require("lodash");
const log_error_1 = require("src/error/log-error");
const fba_reports_client_1 = __importDefault(require("src/services/fba/api/fba.reports.client"));
const calculation_inbounds_1 = __importDefault(require("src/services/fba/inbounds/calculation.inbounds"));
const handleXMLAllOrdersReport = async (data) => {
    try {
        console.log("XML report", data);
        const api_connection = await fba_reports_notifications_controller_1.default.getApiConnection(data);
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
                            title: "Received 30 day orders report",
                            description: `We processed the inventory planning report`,
                            status: client_1.TaskStatus.RUNNING,
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
            status: client_1.AmazonReportStatus.RECEIVED,
        });
        const report = await fba_reports_client_1.default.getReport({
            user: { company_id: api_connection?.company_id },
            reportId: data.payload.reportProcessingFinishedNotification.reportId,
        });
        const doc = await fba_reports_client_1.default.getReportDocument({
            user: { company_id: api_connection?.company_id },
            reportDocumentId: data.payload.reportProcessingFinishedNotification.reportDocumentId,
            reportType: client_1.AmazonReportType.GET_XML_ALL_ORDERS_DATA_BY_LAST_UPDATE_GENERAL,
        });
        const processReport = async () => {
            try {
                const aggregatedOrders = generateAggregatedView(doc.AmazonEnvelope.Message.map((m) => m.Order));
                const products = [];
                for (const aggregatedASINUnitsShipped of aggregatedOrders) {
                    await main_controller_1.prisma.$transaction(async (tx) => {
                        try {
                            const productsWithSameASIN = await tx.amazonProduct.findMany({
                                where: {
                                    owner_id: api_connection?.company_id,
                                    asin: aggregatedASINUnitsShipped.asin,
                                },
                                select: {
                                    sellerSku: true,
                                },
                            });
                            await Promise.all(productsWithSameASIN.map(async (amazonProduct) => {
                                await tx.amazonProduct.update({
                                    where: {
                                        owner_id_sellerSku: {
                                            owner_id: api_connection?.company_id,
                                            sellerSku: amazonProduct.sellerSku,
                                        },
                                    },
                                    data: {
                                        ...aggregatedASINUnitsShipped,
                                    },
                                });
                                const product = await calculation_inbounds_1.default.calculateUnitsShippedT({
                                    owner_id: api_connection?.company_id,
                                    sellerSku: amazonProduct.sellerSku,
                                    tx,
                                });
                                console.log(product.sellerSku);
                                products.push(product);
                            }));
                        }
                        catch (error) {
                            console.log(error.message);
                        }
                    });
                }
                const salesVelocity = await calculation_inbounds_1.default.recalibrateSalesVelocity({
                    user: {
                        company_id: api_connection?.company_id,
                    },
                    products,
                });
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
                                    title: "Finished 30 day orders report",
                                    description: `We processed the all orders report`,
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
                log_error_1.rollbar.error("Failed to process XML all inventories report", error);
                await fba_reports_notifications_controller_1.default.upsertReport({
                    ...data.payload.reportProcessingFinishedNotification,
                    status: client_1.AmazonReportStatus.PROCESSING_ERROR,
                });
            }
        };
        await processReport();
    }
    catch (error) {
        return;
    }
};
exports.handleXMLAllOrdersReport = handleXMLAllOrdersReport;
function generateAggregatedView(orders) {
    const aggregatedView = {};
    let allSkus = [];
    for (const order of orders) {
        let orderItems;
        if (Array.isArray(order.OrderItem)) {
            orderItems = order.OrderItem;
        }
        else {
            orderItems = [order.OrderItem];
        }
        for (const orderItem of orderItems) {
            const sku = orderItem.SKU;
            allSkus = (0, lodash_1.uniq)([...allSkus, sku]);
            const asin = orderItem.ASIN;
            const quantity = orderItem.Quantity;
            const orderStatus = order.OrderStatus;
            if (orderStatus !== "Cancelled") {
                if (!aggregatedView[asin]) {
                    aggregatedView[asin] = {
                        asin: asin,
                        unitsShippedT1: 0,
                        unitsShippedT3: 0,
                        unitsShippedT7: 0,
                        unitsShippedT30: 0,
                        unitsShippedAll: 0,
                    };
                }
                const purchaseDate = new Date(order.PurchaseDate);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                const timeDiff = Math.round(currentDate.getTime() - purchaseDate.getTime()) /
                    (1000 * 60 * 60 * 24);
                if (purchaseDate.getFullYear() === currentDate.getFullYear() &&
                    purchaseDate.getMonth() === currentDate.getMonth() &&
                    purchaseDate.getDate() === currentDate.getDate() - 1) {
                    aggregatedView[asin].unitsShippedT1 += quantity;
                }
                if (0 <= timeDiff && timeDiff <= 3) {
                    aggregatedView[asin].unitsShippedT3 += quantity;
                }
                if (0 <= timeDiff && timeDiff <= 7) {
                    aggregatedView[asin].unitsShippedT7 += quantity;
                }
                if (0 <= timeDiff && timeDiff <= 30) {
                    aggregatedView[asin].unitsShippedT30 += quantity;
                }
                aggregatedView[asin].unitsShippedAll += quantity;
            }
        }
    }
    const result = Object.values(aggregatedView);
    return result;
}
exports.generateAggregatedView = generateAggregatedView;
//# sourceMappingURL=fba.xml-all-orders.handler.js.map