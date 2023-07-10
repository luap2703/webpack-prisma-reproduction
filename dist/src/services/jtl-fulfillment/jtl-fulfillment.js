"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const main_controller_1 = require("../../controllers/main.controller");
const axios_1 = __importDefault(require("axios"));
const log_error_1 = require("../../error/log-error");
const io_1 = require("../socket/io");
class JtlFulfillmentController {
    static productUrl = process.env.JTL_URL + process.env.JTL_PRODUCTS_PATH;
    static warehouseUrl = process.env.JTL_URL + "/v1/merchant/warehouses";
    static stockUrl = process.env.JTL_URL + "/v1/merchant/stocks";
    static fulfillerUrl = process.env.JTL_URL + "/v1/merchant/fulfillers";
    static shippingMethodsUrl = process.env.JTL_URL + "/v1/merchant/shippingmethods";
    static axiosInstance = async (user) => {
        try {
            let instance = axios_1.default;
            const token = await this.getJtlAccessToken(user);
            instance.defaults.headers.common["Authorization"] = "Bearer " + token;
            return instance;
        }
        catch (error) {
            return Promise.reject(error);
        }
    };
    static getJtlStocks = async ({ user, products, }) => {
        try {
            const api = await this.axiosInstance(user);
            let iterableProducts = products;
            let updatedStockSummaries = [];
            if (products[0]?.merchantSku) {
                const jfskus = await main_controller_1.prisma.jtlProduct.findMany({
                    where: {
                        merchantSku: {
                            in: products.map((product) => product.merchant_sku),
                        },
                        owner_id: user.company_id,
                    },
                    select: {
                        jfsku: true,
                        merchantSku: true,
                    },
                });
                console.log(iterableProducts);
                iterableProducts = products
                    .map((product) => {
                    const jfsku = jfskus.find((jfsku) => jfsku.merchantSku === product?.merchantSku)?.jfsku;
                    return {
                        jfsku,
                    };
                })
                    .filter((product) => !!product?.jfsku);
            }
            if (!iterableProducts.length) {
                return [];
            }
            await Promise.all(iterableProducts.map(async (product) => {
                const url = this.stockUrl + `/${product.jfsku}`;
                const stock = (await api.get(url))?.data;
                const jtlStockSummary = await main_controller_1.prisma.jTLStockSummary.upsert({
                    where: {
                        merchantSku: stock.merchantSku,
                    },
                    update: {
                        merchantSku: stock.merchantSku,
                        jfsku: stock.jfsku,
                        stockLevel: stock.stockLevel,
                        stockLevelAnnounced: stock.stockLevelAnnounced,
                        stockLevelBlocked: stock.stockLevelBlocked,
                        stockLevelReserved: stock.stockLevelReserved,
                    },
                    create: {
                        merchantSku: stock.merchantSku,
                        jfsku: stock.jfsku,
                        jtl_stocks: {
                            connectOrCreate: stock.warehouses?.map((warehouseStock) => {
                                return {
                                    where: {
                                        warehouse_id_merchantSku_owner_id: {
                                            warehouse_id: warehouseStock.warehouseId,
                                            merchantSku: stock.merchantSku,
                                            owner_id: user.company_id,
                                        },
                                    },
                                    create: {
                                        warehouse_id: warehouseStock.warehouseId,
                                        owner_id: user.company_id,
                                        stockLevel: warehouseStock.stockLevel,
                                        stockLevelAnnounced: warehouseStock.stockLevelAnnounced,
                                        stockLevelBlocked: warehouseStock.stockLevelBlocked,
                                        stockLevelReserved: warehouseStock.stockLevelReserved,
                                    },
                                };
                            }),
                        },
                        stockLevel: stock.stockLevel,
                        stockLevelAnnounced: stock.stockLevelAnnounced,
                        stockLevelBlocked: stock.stockLevelBlocked,
                        stockLevelReserved: stock.stockLevelReserved,
                    },
                });
                updatedStockSummaries.push(jtlStockSummary);
            }));
            console.log("Received JTL Stock info", updatedStockSummaries.length);
            return updatedStockSummaries;
        }
        catch (error) {
            throw new Error(error);
        }
    };
    static getJtlRecentStockUpdates = async (user) => {
        try {
            const api = await this.axiosInstance(user);
            const jtlSyncSettings = await main_controller_1.prisma.jTLSyncSettings.findUnique({
                where: {
                    company_id: user.company_id,
                },
            });
            await this.updateJtlSyncSettings({
                user,
                data: {
                    import_status: client_1.JTLImportStatus.IMPORTING_STOCKS,
                },
            });
            if (!jtlSyncSettings) {
                throw new Error("No JTL Sync Settings found");
            }
            let nextChunkUrl = undefined;
            let stocks = [];
            const syncDate = new Date();
            while (nextChunkUrl !== null) {
                const url = nextChunkUrl ?? this.stockUrl + `/updates`;
                const response = (await api.get(url, {
                    params: {
                        fromDate: jtlSyncSettings.stocks_last_imported_at?.toISOString(),
                        toDate: syncDate.toISOString(),
                    },
                }))?.data;
                stocks.push(...response.data.map((update) => {
                    return {
                        warehouse_id: update.stockChangeId.warehouseId,
                        jfsku: update.stockChangeId.jfsku,
                        owner_id: user.company_id,
                        merchantSku: update.merchantSku,
                        stockLevel: update.stockLevel,
                        stockLevelAnnounced: update.stockLevelAnnounced,
                        stockLevelBlocked: update.stockLevelBlocked,
                        stockLevelReserved: update.stockLevelReserved,
                        quantity: update.quantity,
                        quantityReserved: update.quantityReserved,
                        quantityBlocked: update.quantityBlocked,
                        quantityAnnounced: update.quantityAnnounced,
                    };
                }));
                if (response.nextChunkUrl) {
                    nextChunkUrl = response.nextChunkUrl;
                }
                else {
                    nextChunkUrl = null;
                }
            }
            const updatedStocks = await main_controller_1.prisma.$transaction(async (tx) => {
                let stocks = [];
                for (const stock of stocks) {
                    try {
                        const updateStocks = await tx.jTLStock.update({
                            where: {
                                warehouse_id_merchantSku_owner_id: {
                                    owner_id: stock.owner_id,
                                    warehouse_id: stock.warehouse_id,
                                    merchantSku: stock.merchantSku,
                                },
                            },
                            data: {
                                stockLevel: stock.stockLevel,
                                stockLevelAnnounced: stock.stockLevelAnnounced,
                                stockLevelBlocked: stock.stockLevelBlocked,
                                stockLevelReserved: stock.stockLevelReserved,
                                jtl_stock_summary: {
                                    update: {
                                        stockLevel: {
                                            increment: stock.stockLevel,
                                        },
                                        stockLevelAnnounced: {
                                            increment: stock.stockLevelAnnounced,
                                        },
                                        stockLevelBlocked: {
                                            increment: stock.stockLevelBlocked,
                                        },
                                        stockLevelReserved: {
                                            increment: stock.stockLevelReserved,
                                        },
                                    },
                                },
                            },
                        });
                        stocks.push(updateStocks);
                    }
                    catch (error) {
                        log_error_1.rollbar.warning(`Error updating JTL Stock. This might be related to a product that is not yet imported to ${process.env.APP_NAME}`, error);
                    }
                }
                return stocks;
            }, {
                maxWait: 1000 * 60 * 1,
                timeout: 1000 * 60 * 1,
            });
            await this.updateJtlSyncSettings({
                user,
                data: {
                    stocks_last_imported_at: syncDate,
                    last_synced_at: syncDate,
                },
            });
            console.log("Successfully updated stocks for", updatedStocks.length, "products");
        }
        catch (error) {
            console.log(error);
            this.updateJtlSyncSettings({
                user,
                data: {
                    last_sync_error: error.message,
                },
            });
        }
    };
    static updateJtlSyncSettings = async ({ user, data, }) => {
        try {
            const updatedJtlSyncSettings = await main_controller_1.prisma.jTLSyncSettings.update({
                where: {
                    company_id: user.company_id,
                },
                data: {
                    ...data,
                },
            });
            io_1.io.to(user.company_id).emit("jtl:sync");
            return updatedJtlSyncSettings;
        }
        catch (error) {
            io_1.io.to(user.company_id).emit("error", error?.message);
        }
    };
    static getJtlAccessToken = async (user) => {
        const api_connection = await main_controller_1.prisma.apiConnection.findUnique({
            where: {
                apiconnection_id: {
                    company_id: user.company_id,
                    api_provider: client_1.ApiProvider.JTL_FULFILLMENT,
                },
            },
        });
        if (!api_connection?.access_token ||
            !api_connection?.refresh_token ||
            !api_connection?.expires_at) {
            log_error_1.rollbar.info("No connection yet established");
            return Promise.reject("No connection yet established");
        }
        if (api_connection.expires_at < new Date()) {
            const accessToken = await this.refreshJtlToken(user, api_connection.refresh_token);
            return accessToken;
        }
        return api_connection.access_token;
    };
    static refreshJtlToken = async (user, refresh_token, type = "refresh_token") => {
        try {
            const response = await axios_1.default.post(process.env.JTL_TOKEN_URL, new URLSearchParams({
                grant_type: `${type}`,
                code: `${type == "authorization_code" ? refresh_token : ""}`,
                refresh_token: `${type == "refresh_token" ? refresh_token : ""}`,
            }), {
                auth: {
                    username: process.env.JTL_CLIENT_ID,
                    password: process.env.JTL_CLIENT_SECRET,
                },
            });
            const expires_at = new Date();
            const current_date = new Date();
            expires_at.setTime(expires_at.getTime() + response.data.expires_in * 1000 - 2000);
            const connection = await main_controller_1.prisma.company.update({
                where: {
                    company_id: user.company_id,
                },
                data: {
                    api_connection: {
                        upsert: {
                            where: {
                                apiconnection_id: {
                                    api_provider: "JTL_FULFILLMENT",
                                    company_id: user.company_id,
                                },
                            },
                            update: {
                                expires_at: expires_at,
                                access_token: response.data.access_token,
                                refresh_token: response.data.refresh_token,
                                updated_at: current_date,
                            },
                            create: {
                                api_provider: "JTL_FULFILLMENT",
                                expires_at: expires_at,
                                access_token: response.data.access_token,
                                refresh_token: response.data.refresh_token,
                                updated_at: current_date,
                                created_at: current_date,
                            },
                        },
                    },
                },
                include: {
                    api_connection: {
                        where: {
                            api_provider: "JTL_FULFILLMENT",
                        },
                    },
                },
            });
            const access_token = response.data.access_token;
            return access_token;
        }
        catch (error) {
            if (error.response.status == 401) {
                log_error_1.rollbar.info("401 error");
                await main_controller_1.prisma.apiConnection.update({
                    where: {
                        apiconnection_id: {
                            company_id: user.company_id,
                            api_provider: client_1.ApiProvider.JTL_FULFILLMENT,
                        },
                    },
                    data: {
                        outdated: true,
                    },
                });
            }
            throw new Error(error);
        }
    };
}
exports.default = JtlFulfillmentController;
//# sourceMappingURL=jtl-fulfillment.js.map