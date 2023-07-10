"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const selling_partner_api_sdk_1 = require("@scaleleap/selling-partner-api-sdk");
const reports_api_model_1 = require("@scaleleap/selling-partner-api-sdk/lib/api-models/reports-api-model");
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const xml_js_1 = __importDefault(require("xml-js"));
const zlib_1 = __importDefault(require("zlib"));
const main_controller_1 = require("../../../controllers/main.controller");
const fba_auth_1 = __importDefault(require("../auth/fba.auth"));
const tab_delimited_to_array_1 = require("../utils/tab-delimited-to-array");
class FbaReportsController {
    static createReportSchedule = async ({ user, reportType, period = reports_api_model_1.CreateReportScheduleSpecificationPeriodEnum.Pt30M, }) => {
        try {
            const client = new selling_partner_api_sdk_1.ReportsApiClient(await fba_auth_1.default.getApiParams(user));
            const existingSchedule = await main_controller_1.prisma.amazonReportSchedule.findUnique({
                where: {
                    company_id_reportType: {
                        company_id: user.company_id,
                        reportType,
                    },
                },
            });
            if (existingSchedule) {
                console.info("Schedule already exists", existingSchedule.reportScheduleId);
                return;
            }
            const request = await client.createReportSchedule({
                body: {
                    reportType,
                    marketplaceIds: [fba_auth_1.default.getMarketplace.id],
                    period,
                },
            });
            console.info(request.data);
            const schedule = await main_controller_1.prisma.amazonReportSchedule.create({
                data: {
                    reportScheduleId: request.data.payload?.reportScheduleId,
                    company_id: user.company_id,
                    api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                    reportType,
                },
            });
            console.info("Schedule created", schedule);
            return schedule;
        }
        catch (error) {
            console.error(error);
        }
    };
    static deleteReportSchedule = async ({ user, reportType, }) => {
        const client = new selling_partner_api_sdk_1.ReportsApiClient(await fba_auth_1.default.getApiParams(user));
        const existingSchedule = await main_controller_1.prisma.amazonReportSchedule.findUnique({
            where: {
                company_id_reportType: {
                    company_id: user.company_id,
                    reportType,
                },
            },
        });
        if (existingSchedule) {
            console.info("Schedule already exists", existingSchedule.reportScheduleId);
            return;
        }
        const reportSchedule = await main_controller_1.prisma.amazonReportSchedule.findUnique({
            where: {
                company_id_reportType: {
                    company_id: user.company_id,
                    reportType,
                },
            },
        });
        if (!reportSchedule) {
            console.info("No schedule to be deleted");
            return;
        }
        const request = await client.cancelReportSchedule({
            reportScheduleId: reportSchedule?.reportScheduleId,
        });
        console.info(request.data);
        return request.data;
    };
    static deleteAllReportSchedules = async ({ user, }) => {
        const client = new selling_partner_api_sdk_1.ReportsApiClient(await fba_auth_1.default.getApiParams(user));
        const reportSchedule = await main_controller_1.prisma.amazonReportSchedule.findMany({
            where: {
                company_id: user.company_id,
            },
        });
        if (!reportSchedule) {
            console.info("No schedule to be deleted");
            return;
        }
        await Promise.all(reportSchedule.map(async (schedule) => {
            const request = await client.cancelReportSchedule({
                reportScheduleId: schedule?.reportScheduleId,
            });
            const deletedSchedule = await main_controller_1.prisma.amazonReportSchedule.delete({
                where: {
                    company_id_reportType: {
                        company_id: user.company_id,
                        reportType: schedule.reportType,
                    },
                },
            });
            console.info(request.data);
        }));
        return;
    };
    static createReport = async ({ user, reportType, dataStartTime, dataEndTime, }) => {
        try {
            const client = new selling_partner_api_sdk_1.ReportsApiClient(await fba_auth_1.default.getApiParams({
                company_id: user.company_id,
            }));
            console.log("Requesting", reportType, "report");
            const request = await client.createReport({
                body: {
                    reportType,
                    marketplaceIds: [fba_auth_1.default.getMarketplace.id],
                    dataStartTime: dataStartTime?.toISOString(),
                    dataEndTime: dataEndTime?.toISOString(),
                },
            });
            if (!request.data.payload?.reportId) {
                throw new Error("No report id");
            }
            await main_controller_1.prisma.amazonReport.create({
                data: {
                    reportId: request.data.payload.reportId,
                    reportType,
                    api_connection: {
                        connect: {
                            apiconnection_id: {
                                company_id: user.company_id,
                                api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                            },
                        },
                    },
                    dataStartTime,
                    dataEndTime,
                },
            });
            return request.data.payload.reportId;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };
    static getReport = async ({ user, reportId, }) => {
        try {
            const client = new selling_partner_api_sdk_1.ReportsApiClient(await fba_auth_1.default.getApiParams({
                company_id: user.company_id,
            }));
            const request = await client.getReport({
                reportId,
            });
            if (!request.data.payload) {
                throw new Error("No report url");
            }
            const repo = request.data.payload;
            const apiConnection = await main_controller_1.prisma.apiConnection.findUnique({
                where: {
                    apiconnection_id: {
                        company_id: user.company_id,
                        api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                    },
                },
            });
            const report = await main_controller_1.prisma.amazonReport.upsert({
                where: {
                    reportId: reportId,
                },
                update: {
                    dataStartTime: repo.dataStartTime,
                    dataEndTime: repo.dataEndTime,
                    reportType: repo.reportType,
                },
                create: {
                    sellerId: apiConnection.api_username,
                    reportId: repo.reportId,
                    reportType: repo.reportType,
                    dataStartTime: repo.dataStartTime,
                    dataEndTime: repo.dataEndTime,
                    api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                },
            });
            return report;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };
    static getReportDocument = async ({ user: { company_id }, reportDocumentId, reportType, }) => {
        const params = await fba_auth_1.default.getApiParams({ company_id });
        const client = new selling_partner_api_sdk_1.ReportsApiClient(params);
        const getReportDocument = async (retry) => {
            try {
                const response = await client.getReportDocument({
                    reportDocumentId,
                });
                return response;
            }
            catch (error) {
                throw error;
                await new Promise((resolve) => setTimeout(resolve, 2));
                return await getReportDocument(true);
            }
        };
        const reportDocument = await client.getReportDocument({
            reportDocumentId,
        });
        if (!reportDocument.data.payload?.url) {
            console.error("No report url", reportDocument);
            throw new Error("No report url");
        }
        let chunks = [];
        const encryptionDetails = reportDocument.data.payload.encryptionDetails;
        const documentRequest = await axios_1.default.get(reportDocument.data.payload?.url, {
            responseType: "stream",
        });
        chunks = await new Promise((resolve, reject) => {
            documentRequest.data.on("data", (chunk) => {
                chunks.push(chunk);
            });
            documentRequest.data.on("end", () => {
                resolve(chunks);
            });
            documentRequest.data.on("error", (error) => {
                reject(error);
            });
        });
        let decryptedData = decryptBuffer(encryptionDetails, chunks);
        if (reportDocument.data.payload.compressionAlgorithm === "GZIP") {
            decryptedData = zlib_1.default.gunzipSync(decryptedData);
        }
        if ([
            client_1.AmazonReportType.GET_XML_ALL_ORDERS_DATA_BY_LAST_UPDATE_GENERAL,
            client_1.AmazonReportType.GET_XML_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL,
        ].includes(reportType)) {
            const jsObject = xml_js_1.default.xml2js(decryptedData.toString(), {
                compact: true,
                trim: true,
                ignoreDeclaration: true,
                ignoreInstruction: true,
                ignoreAttributes: true,
                ignoreComment: true,
                ignoreCdata: true,
                ignoreDoctype: true,
                textFn: removeJsonTextAttribute,
                nativeType: false,
            });
            return jsObject;
        }
        else {
            const data = await (0, tab_delimited_to_array_1.tabDelimitedToArray)(decryptedData);
            return data;
        }
    };
}
exports.default = FbaReportsController;
const decryptBuffer = (encryptionDetails, chunks) => {
    if (encryptionDetails) {
        let encrypted_buffer = Buffer.concat(chunks);
        let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(encryptionDetails.key, "base64"), Buffer.from(encryptionDetails.initializationVector, "base64"));
        return Buffer.concat([decipher.update(encrypted_buffer), decipher.final()]);
    }
    return Buffer.concat(chunks);
};
const nativeType = function (value) {
    let nValue = Number(value);
    if (!isNaN(nValue)) {
        return nValue;
    }
    let bValue = value.toLowerCase();
    if (bValue === "true") {
        return true;
    }
    else if (bValue === "false") {
        return false;
    }
    return value;
};
const removeJsonTextAttribute = function (value, parentElement) {
    try {
        const parentOfParent = parentElement._parent;
        const pOpKeys = Object.keys(parentElement._parent);
        const keyNo = pOpKeys.length;
        const keyName = pOpKeys[keyNo - 1];
        const arrOfKey = parentElement._parent[keyName];
        const arrOfKeyLen = arrOfKey.length;
        if (arrOfKeyLen > 0) {
            const arr = arrOfKey;
            const arrIndex = arrOfKey.length - 1;
            arr[arrIndex] = value;
        }
        else {
            parentElement._parent[keyName] = nativeType(value);
        }
    }
    catch (e) { }
};
//# sourceMappingURL=fba.reports.client.js.map