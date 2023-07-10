"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = require("@controllers/main.controller");
const tasks_controller_1 = __importDefault(require("@controllers/tasks.controller"));
const client_1 = require("@prisma/client");
const log_error_1 = require("src/error/log-error");
const fba_reports_client_1 = __importDefault(require("src/services/fba/api/fba.reports.client"));
const fba_auth_1 = __importDefault(require("src/services/fba/auth/fba.auth"));
const fba_xml_all_orders_handler_1 = require("src/services/fba/controllers/fba.xml-all-orders.handler");
const get_historic_planning_data_1 = require("src/services/fba/controllers/get-historic-planning-data");
const initialize_synchronization_1 = require("src/services/fba/controllers/initialize-synchronization");
class FbaReportNotificationsController {
    static handleReportNotification = async (data) => {
        if (!data.payload) {
            console.error("No payload", data);
            return;
        }
        const sellerId = data.payload.reportProcessingFinishedNotification.sellerId;
        const processingStatus = data.payload.reportProcessingFinishedNotification.processingStatus;
        const reportId = data.payload.reportProcessingFinishedNotification.reportId;
        const reportDocumentId = data.payload.reportProcessingFinishedNotification.reportDocumentId;
        const reportType = data.payload.reportProcessingFinishedNotification.reportType;
        console.log("Processing report", reportType, processingStatus, reportId);
        if (!sellerId) {
            console.error("No sellerId", data);
            return;
        }
        if (processingStatus !== "DONE" || !reportDocumentId) {
            if (data.payload.reportProcessingFinishedNotification.processingStatus !==
                "CANCELLED") {
                try {
                    log_error_1.rollbar.error("Report failed", data.payload.reportProcessingFinishedNotification.processingStatus, data.payload.reportProcessingFinishedNotification.reportType);
                    const failedReport = await main_controller_1.prisma.amazonReport.update({
                        where: {
                            reportId: reportId,
                        },
                        data: {
                            status: client_1.AmazonReportStatus.ERROR,
                        },
                    });
                    if (data.payload.reportProcessingFinishedNotification.reportType ===
                        client_1.AmazonReportType.GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA) {
                        const lastReport = await main_controller_1.prisma.amazonReport.findFirst({
                            where: {
                                reportType: client_1.AmazonReportType.GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA,
                                status: {
                                    in: [
                                        client_1.AmazonReportStatus.RECEIVED,
                                        client_1.AmazonReportStatus.COMPLETED,
                                    ],
                                },
                            },
                            orderBy: {
                                created_at: "desc",
                            },
                        });
                        if (!!lastReport) {
                            console.log("Processing last report instead");
                            await (0, initialize_synchronization_1.handleMYIAllUnsuppressedInventoryReport)({
                                payload: {
                                    reportProcessingFinishedNotification: {
                                        ...lastReport,
                                        reportDocumentId: lastReport.reportDocumentId ?? undefined,
                                        processingStatus: "DONE",
                                    },
                                },
                            });
                        }
                        else {
                            const apiConnection = await main_controller_1.prisma.apiConnection.findUniqueOrThrow({
                                where: {
                                    api_username_api_provider: {
                                        api_username: sellerId,
                                        api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                                    },
                                },
                            });
                            tasks_controller_1.default.upsertTask({
                                user: {
                                    company_id: apiConnection.company_id,
                                },
                                task: {
                                    title: "FBA Synchronization",
                                    status: client_1.TaskStatus.ERROR,
                                    events: {
                                        create: [
                                            {
                                                title: "Fatal error",
                                                description: "Fatal error when processing report. This might occur as the report has been requested too often.",
                                                status: client_1.TaskStatus.ERROR,
                                            },
                                        ],
                                    },
                                },
                            });
                        }
                    }
                    else {
                        console.log(data);
                    }
                }
                catch { }
            }
            return;
        }
        const existingReport = await main_controller_1.prisma.amazonReport.findUnique({
            where: {
                reportId,
                status: {
                    not: client_1.AmazonReportStatus.CREATED,
                },
            },
        });
        if (!!existingReport) {
            if (existingReport.reportType !==
                client_1.AmazonReportType.GET_XML_ALL_ORDERS_DATA_BY_LAST_UPDATE_GENERAL) {
                console.info("Report already processed", reportType);
            }
            return;
        }
        switch (reportType) {
            case client_1.AmazonReportType.GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT:
                await this.handleRecommendationsReport(data);
                break;
            case client_1.AmazonReportType.GET_FBA_INVENTORY_PLANNING_DATA:
                await (0, get_historic_planning_data_1.handlePlanningReport)(data);
                break;
            case client_1.AmazonReportType.GET_XML_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL:
                await (0, fba_xml_all_orders_handler_1.handleXMLAllOrdersReport)(data);
                break;
            case client_1.AmazonReportType.GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA:
            case client_1.AmazonReportType.GET_FBA_MYI_ALL_INVENTORY_DATA:
                await (0, initialize_synchronization_1.handleMYIAllUnsuppressedInventoryReport)(data);
                break;
            default:
                await this.handleOtherReport(data);
                break;
        }
    };
    static upsertReport = async ({ reportId, reportType, sellerId, reportDocumentId, status, }) => {
        if (!reportId) {
            console.error("No reportId", reportId);
            return;
        }
        const newReport = await main_controller_1.prisma.amazonReport.upsert({
            where: {
                reportId,
            },
            update: {
                reportDocumentId,
                status,
            },
            create: {
                reportId,
                reportType: reportType,
                sellerId,
                reportDocumentId,
                status,
            },
        });
        return newReport;
    };
    static handleRecommendationsReport = async (data) => {
        try {
            await this.upsertReport({
                ...data.payload.reportProcessingFinishedNotification,
                status: client_1.AmazonReportStatus.RECEIVED,
            });
            return;
            log_error_1.rollbar.info("Received recommendations report");
            const api_connection = await this.getApiConnection(data);
            const params = await fba_auth_1.default.getApiParams({
                company_id: api_connection?.company_id,
            });
            const planningReportId = await fba_reports_client_1.default.createReport({
                user: {
                    company_id: api_connection?.company_id,
                },
                reportType: client_1.AmazonReportType.GET_FBA_INVENTORY_PLANNING_DATA,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    };
    static handleOtherReport = async (data) => {
        console.log("Other report", data.payload.reportProcessingFinishedNotification.reportType);
    };
    static getApiConnection = async (data) => {
        const sellerId = data.payload.reportProcessingFinishedNotification.sellerId;
        const api_connection = await main_controller_1.prisma.apiConnection.findUnique({
            where: {
                api_username_api_provider: {
                    api_username: sellerId,
                    api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                },
            },
        });
        if (!api_connection) {
            throw new Error("Api connection not found");
        }
        return api_connection;
    };
}
exports.default = FbaReportNotificationsController;
//# sourceMappingURL=fba.reports.notifications.controller.js.map