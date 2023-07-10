"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const selling_partner_api_sdk_1 = require("@scaleleap/selling-partner-api-sdk");
const lodash_1 = __importDefault(require("lodash"));
const main_controller_1 = require("../../../controllers/main.controller");
const fba_auth_1 = __importDefault(require("../auth/fba.auth"));
const { chunk } = lodash_1.default;
class FbaProductsController {
    static getCatalogItems = async (user, products, { token, apiParams, marketplaces }) => {
        console.info("Getting catalog items");
        const connection = await main_controller_1.prisma.apiConnection.findUnique({
            where: {
                apiconnection_id: {
                    company_id: user.company_id,
                    api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                },
            },
        });
        const catalog = new selling_partner_api_sdk_1.CatalogItemsApiClientV20220401(apiParams);
        const batches = chunk(products, 20);
        console.log("Number of batches:", batches.length);
        for (const batch of batches) {
            await Promise.all([
                (async () => {
                    const data = await catalog.searchCatalogItems({
                        sellerId: connection?.api_username,
                        marketplaceIds: marketplaces.map((m) => m.id).slice(0, 1),
                        identifiers: batch.map((item) => item.sellerSku),
                        identifiersType: "SKU",
                        includedData: [
                            "summaries",
                            "attributes",
                            "dimensions",
                            "identifiers",
                            "productTypes",
                            "relationships",
                            "images",
                        ],
                        pageSize: 20,
                    });
                    const catalogSummaries = data.data?.items;
                    for (const catalogSummary of catalogSummaries) {
                        const images = catalogSummary?.images?.find((ImagesByMarketplace) => {
                            return (ImagesByMarketplace.marketplaceId ===
                                fba_auth_1.default.getMarketplace.id);
                        })?.images;
                        try {
                            const product = await main_controller_1.prisma.amazonProduct.updateMany({
                                where: {
                                    owner_id: user.company_id,
                                    sellerSku: {
                                        in: products
                                            .filter((p) => p.asin === catalogSummary.asin)
                                            .map((p) => p.sellerSku),
                                    },
                                },
                                data: {
                                    images: images,
                                    catalogSummary: catalogSummary,
                                    owner_id: user.company_id,
                                },
                            });
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                })(),
                (async () => {
                    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
                })(),
            ]);
        }
        return;
    };
    static getInventorySummaries = async ({ user, products, token, apiParams, marketplaces, }) => {
        console.info("Getting inventory summaries");
        const client = new selling_partner_api_sdk_1.FbaInventoryApiClient(apiParams);
        let countUpdatedProducts = 0;
        const batches = chunk(products, 50);
        for (const batch of batches) {
            await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
            const retrySummaries = async (retryCount) => {
                try {
                    return await client.getInventorySummaries({
                        granularityType: "Marketplace",
                        marketplaceIds: marketplaces.map((m) => m.id).slice(0, 1),
                        granularityId: marketplaces.map((m) => m.id)[0],
                        sellerSkus: batch.map((p) => p.sku),
                        details: true,
                    });
                }
                catch (error) {
                    if ((retryCount ?? 0) <= 3) {
                        await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
                        return await retrySummaries((retryCount ?? 0) + 1);
                    }
                    else {
                        throw error;
                    }
                }
            };
            const response = await retrySummaries();
            const newInventories = response.data.payload.inventorySummaries;
            await Promise.all(newInventories.map(async (newInventory) => {
                try {
                    const details = newInventory.inventoryDetails;
                    const newTotalQuantity = (details.fulfillableQuantity ?? 0) +
                        (details.inboundReceivingQuantity ?? 0) +
                        (details.inboundShippedQuantity ?? 0) +
                        (details.inboundWorkingQuantity ?? 0) +
                        (details.reservedQuantity?.pendingTransshipmentQuantity ?? 0);
                    const existingProduct = await main_controller_1.prisma.amazonProduct.findUnique({
                        where: {
                            owner_id_sellerSku: {
                                owner_id: user.company_id,
                                sellerSku: newInventory.sellerSku ?? "",
                            },
                        },
                    });
                    if (existingProduct) {
                        const productCount = await main_controller_1.prisma.amazonProduct.updateMany({
                            where: {
                                owner_id: user.company_id,
                                asin: newInventory.asin,
                            },
                            data: {
                                inventoryDetails: newInventory?.inventoryDetails,
                                inventorySummary: newInventory,
                                total_quantity: newTotalQuantity,
                            },
                        });
                        countUpdatedProducts += productCount.count;
                    }
                }
                catch (e) {
                    console.error(e.message);
                }
            }));
        }
        console.info("Updated inventories for", countUpdatedProducts, "products", user.company_id.slice(-4));
        return countUpdatedProducts;
    };
    static getInboundEligibilityPreviews = async ({ user, products, }) => {
        try {
            let res = null;
            const batches = lodash_1.default.chunk(products, 10);
            let x = 1;
            for (const batch of batches) {
                const client = new selling_partner_api_sdk_1.FbaInboundEligibilityApiClient(await fba_auth_1.default.getApiParams(user));
                const getEligibility = async ({ asin, program, }, retryCount) => {
                    try {
                        const response = await client.getItemEligibilityPreview({
                            marketplaceIds: [fba_auth_1.default.getMarketplace.id],
                            asin,
                            program: "INBOUND",
                        });
                        return response.data;
                    }
                    catch (error) {
                        if (error.cause.response.status === 429 && (retryCount ?? 0) < 4) {
                            await new Promise((resolve) => setTimeout(resolve, ((retryCount ?? 0) + 1) * 4000));
                            return await getEligibility({
                                asin,
                                program,
                            }, (retryCount ?? 0) + 1);
                        }
                        else {
                            throw error;
                        }
                    }
                };
                for (const product of batch) {
                    const inboundEligibility = await getEligibility({
                        asin: products[0].asin,
                        program: "INBOUND",
                    });
                    const comminglingEligibility = await getEligibility({
                        asin: products[0].asin,
                        program: "COMMINGLING",
                    });
                    const amazonProducts = await main_controller_1.prisma.amazonProduct.updateMany({
                        where: {
                            owner_id: user.company_id,
                            asin: product.asin,
                        },
                        data: {
                            isEligibleForInboundShipments: inboundEligibility.payload?.isEligibleForProgram,
                            isEligibleForInboundShipmentsErrors: inboundEligibility.payload?.ineligibilityReasonList,
                            isEligibleForCommingling: comminglingEligibility.payload?.isEligibleForProgram,
                            isEligibleForComminglingErrors: comminglingEligibility.payload?.ineligibilityReasonList,
                        },
                    });
                }
            }
            return true;
        }
        catch (error) {
            console.error(error?.message);
            return false;
        }
    };
}
exports.default = FbaProductsController;
//# sourceMappingURL=fba.products.client.js.map