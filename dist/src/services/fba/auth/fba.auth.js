"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const amazon_marketplaces_1 = require("@scaleleap/amazon-marketplaces");
const axios_1 = __importDefault(require("axios"));
const main_controller_1 = require("../../../controllers/main.controller");
const log_error_1 = require("../../../error/log-error");
class FbaAuthenticator {
    static getApiParams = async ({ company_id, }) => {
        const apiParams = {
            accessToken: await this.getFBAToken({ company_id }),
            region: "eu-west-1",
            basePath: "https://sellingpartnerapi-eu.amazon.com",
            roleArn: process.env.FBA_ARN_ROLE,
            credentials: {
                accessKeyId: process.env.FBA_CLIENT_ID,
                secretAccessKey: process.env.FBA_CLIENT_SECRET,
            },
        };
        return apiParams;
    };
    static getMarketplace = (() => {
        const DE = (0, amazon_marketplaces_1.findAmazonMarketplaceOrFail)("countryCode", amazon_marketplaces_1.AmazonMarketplaceCountryCode.DE);
        return DE;
    })();
    static getFBAToken = async ({ company_id, }) => {
        if (!company_id) {
            return Promise.reject("No company id provided");
        }
        const api_connection = await main_controller_1.prisma.apiConnection.findFirst({
            where: {
                company_id: company_id,
                api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
            },
        });
        if (!api_connection?.access_token ||
            !api_connection?.refresh_token ||
            !api_connection?.expires_at) {
            log_error_1.rollbar.info("No connection yet established");
            return Promise.reject("No connection yet established");
        }
        if (api_connection.expires_at < new Date(Date.now() + 1000 * 60)) {
            console.info("Token is expired");
            const accessToken = await this.refreshFBAToken({
                company_id: company_id,
            }, api_connection.refresh_token);
            return accessToken;
        }
        else {
            return api_connection.access_token;
        }
    };
    static refreshFBAToken = async ({ company_id }, refresh_token, type = "refresh_token") => {
        try {
            const response = await axios_1.default.post("https://api.amazon.com/auth/o2/token", new URLSearchParams({
                ...(type === "refresh_token" ? { grant_type: "refresh_token" } : {}),
                ...(type === "refresh_token" ? { refresh_token } : {}),
                ...(type === "authorization_code" ? { code: refresh_token } : {}),
                client_id: process.env.FBA_CLIENT_ID,
                client_secret: process.env.FBA_CLIENT_SECRET,
            }));
            const connection = await main_controller_1.prisma.apiConnection.upsert({
                where: {
                    apiconnection_id: {
                        company_id: company_id,
                        api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                    },
                },
                update: {
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                    expires_at: new Date(Date.now() + response.data.expires_in * 1000 - 10_000),
                },
                create: {
                    api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                    company_id: company_id,
                    expires_at: new Date(Date.now() + response.data.expires_in * 1000 - 10_000),
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                },
            });
            return connection.access_token;
        }
        catch (error) {
            throw new Error(error);
        }
    };
}
exports.default = FbaAuthenticator;
//# sourceMappingURL=fba.auth.js.map