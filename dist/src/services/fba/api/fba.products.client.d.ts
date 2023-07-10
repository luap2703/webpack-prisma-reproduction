import { AmazonMarketplace } from "@scaleleap/amazon-marketplaces";
type FbaInitiatorParams = {
    token: string;
    apiParams: {
        accessToken: string;
        region: string;
        basePath: string;
        roleArn: string;
        credentials: {
            accessKeyId: string;
            secretAccessKey: string;
        };
    };
    marketplaces?: AmazonMarketplace[];
};
export default class FbaProductsController {
    static getCatalogItems: (user: {
        company_id: string;
    }, products: {
        sellerSku: string;
        asin: string;
    }[], { token, apiParams, marketplaces }: FbaInitiatorParams) => Promise<void>;
    static getInventorySummaries: ({ user, products, token, apiParams, marketplaces, }: {
        user: {
            company_id: string;
        };
        products: {
            sku: string;
        }[];
        token: string;
        apiParams: FbaInitiatorParams["apiParams"];
        marketplaces?: AmazonMarketplace[] | undefined;
    }) => Promise<number>;
    static getInboundEligibilityPreviews: ({ user, products, }: {
        user: {
            company_id: string;
        };
        products: {
            asin: string;
        }[];
    }) => Promise<boolean>;
}
export {};
