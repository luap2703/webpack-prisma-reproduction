import { AmazonReportStatus, AmazonReportType, ApiProvider } from "@prisma/client";
import { ReportProcessingFinishedNotification } from "./types/src";
export default class FbaReportNotificationsController {
    static handleReportNotification: (data: ReportProcessingFinishedNotification) => Promise<void>;
    static upsertReport: ({ reportId, reportType, sellerId, reportDocumentId, status, }: {
        reportId: string;
        reportType: AmazonReportType | string;
        sellerId: string;
        reportDocumentId?: string | undefined;
        status: AmazonReportStatus;
    }) => Promise<(import("@prisma/client/runtime").GetResult<{
        reportId: string;
        reportType: AmazonReportType;
        status: AmazonReportStatus;
        reportDocumentId: string | null;
        sellerId: string;
        api_provider: ApiProvider;
        updated_at: Date;
        created_at: Date;
        dataStartTime: Date | null;
        dataEndTime: Date | null;
    }, {
        [x: string]: () => unknown;
    }, never> & {}) | undefined>;
    static handleRecommendationsReport: (data: ReportProcessingFinishedNotification) => Promise<void>;
    static handleOtherReport: (data: ReportProcessingFinishedNotification) => Promise<void>;
    static getApiConnection: (data: ReportProcessingFinishedNotification) => Promise<import("@prisma/client/runtime").GetResult<{
        company_id: string;
        api_provider: ApiProvider;
        api_username: string | null;
        created_at: Date;
        updated_at: Date;
        access_token: string;
        refresh_token: string;
        expires_at: Date;
        outdated: boolean;
        amazon_last_order_sync_at: Date | null;
        amazon_settings: import(".prisma/client").Prisma.JsonValue;
    }, {
        [x: string]: () => unknown;
    }, never> & {}>;
}
