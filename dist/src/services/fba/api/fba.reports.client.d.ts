import { AmazonReportType, ApiProvider } from "@prisma/client";
import { CreateReportScheduleSpecificationPeriodEnum } from "@scaleleap/selling-partner-api-sdk/lib/api-models/reports-api-model";
export default class FbaReportsController {
    static createReportSchedule: ({ user, reportType, period, }: {
        user: {
            company_id: string;
        };
        reportType: AmazonReportType;
        period?: CreateReportScheduleSpecificationPeriodEnum | undefined;
    }) => Promise<(import("@prisma/client/runtime").GetResult<{
        company_id: string;
        api_provider: ApiProvider;
        reportType: AmazonReportType;
        reportScheduleId: string;
        updated_at: Date;
        created_at: Date;
    }, {
        [x: string]: () => unknown;
    }, never> & {}) | undefined>;
    static deleteReportSchedule: ({ user, reportType, }: {
        user: {
            company_id: string;
        };
        reportType: AmazonReportType;
    }) => Promise<import("@scaleleap/selling-partner-api-sdk").ReportsApiModelCancelReportScheduleResponse | undefined>;
    static deleteAllReportSchedules: ({ user, }: {
        user: {
            company_id: string;
        };
    }) => Promise<void>;
    static createReport: ({ user, reportType, dataStartTime, dataEndTime, }: {
        user: {
            company_id: string;
        };
        reportType: AmazonReportType;
        dataStartTime?: Date | undefined;
        dataEndTime?: Date | undefined;
    }) => Promise<string>;
    static getReport: ({ user, reportId, }: {
        user: {
            company_id: string;
        };
        reportId: string;
    }) => Promise<import("@prisma/client/runtime").GetResult<{
        reportId: string;
        reportType: AmazonReportType;
        status: import(".prisma/client").AmazonReportStatus;
        reportDocumentId: string | null;
        sellerId: string;
        api_provider: ApiProvider;
        updated_at: Date;
        created_at: Date;
        dataStartTime: Date | null;
        dataEndTime: Date | null;
    }, {
        [x: string]: () => unknown;
    }, never> & {}>;
    static getReportDocument: ({ user: { company_id }, reportDocumentId, reportType, }: {
        user: {
            company_id: string;
        };
        reportDocumentId: string;
        reportType: AmazonReportType;
    }) => Promise<any>;
}
