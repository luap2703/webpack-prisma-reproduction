import { JTLImportStatus, Prisma } from "@prisma/client";
export default class JtlFulfillmentController {
    static productUrl: string;
    static warehouseUrl: string;
    static stockUrl: string;
    static fulfillerUrl: string;
    static shippingMethodsUrl: string;
    static axiosInstance: (user: {
        company_id: string;
    }) => Promise<import("axios").AxiosStatic>;
    static getJtlStocks: ({ user, products, }: {
        user: {
            company_id: string;
        };
        products: {
            jfsku?: string;
            merchantSku?: string;
        }[];
    }) => Promise<(import("@prisma/client/runtime").GetResult<{
        jfsku: string;
        merchantSku: string;
        stockLevel: number;
        stockLevelReserved: number;
        stockLevelAnnounced: number;
        stockLevelBlocked: number;
        updated_at: Date;
        created_at: Date;
    }, unknown, never> & {})[]>;
    static getJtlRecentStockUpdates: (user: {
        company_id: string;
    }) => Promise<void>;
    static updateJtlSyncSettings: ({ user, data, }: {
        user: {
            company_id: string;
        };
        data: Prisma.JTLSyncSettingsUpdateInput;
    }) => Promise<(import("@prisma/client/runtime").GetResult<{
        company_id: string;
        defaultSkuMatchingPattern: string;
        fulfillers_last_imported_at: Date | null;
        warehouses_last_imported_at: Date | null;
        products_last_imported_at: Date | null;
        stocks_last_imported_at: Date | null;
        import_status: JTLImportStatus;
        last_import_error: string | null;
        current_sync_status: import(".prisma/client").JTLSyncStatus;
        last_synced_at: Date | null;
        last_sync_error: string | null;
        updated_at: Date;
        created_at: Date;
    }, {
        [x: string]: () => unknown;
    }, never> & {}) | undefined>;
    static getJtlAccessToken: (user: {
        company_id: string;
    }) => Promise<any>;
    static refreshJtlToken: (user: {
        company_id: string;
    }, refresh_token: string, type?: string) => Promise<any>;
}
