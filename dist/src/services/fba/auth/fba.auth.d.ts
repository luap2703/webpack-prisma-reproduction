export default class FbaAuthenticator {
    static getApiParams: ({ company_id, }: {
        company_id: string | null;
    }) => Promise<{
        accessToken: string;
        region: string;
        basePath: string;
        roleArn: string;
        credentials: {
            accessKeyId: string;
            secretAccessKey: string;
        };
    }>;
    static getMarketplace: import("@scaleleap/amazon-marketplaces").AmazonMarketplace;
    static getFBAToken: ({ company_id, }: {
        company_id: string | null;
    }) => Promise<string>;
    static refreshFBAToken: ({ company_id }: {
        company_id: string;
    }, refresh_token: string, type?: string) => Promise<string>;
}
