"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const lodash_1 = __importDefault(require("lodash"));
const main_controller_1 = require("../../../controllers/main.controller");
class FbaInboundCalculator {
    static checkInventoryHealth = async ({ user, }) => {
        const apiConnection = await main_controller_1.prisma.apiConnection.findUnique({
            where: {
                apiconnection_id: {
                    company_id: user.company_id,
                    api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                },
            },
        });
        const products = await main_controller_1.prisma.amazonProduct.findMany({
            where: {
                owner_id: user.company_id,
                days_until_restock: {
                    lte: 1,
                },
                costsPerDay: {
                    not: null,
                },
                total_quantity: {
                    not: null,
                },
                sales_velocity: {
                    not: null,
                },
                days_on_stock: {
                    not: null,
                },
                products_per_carton: {
                    not: null,
                },
            },
            include: {
                jtl_product: {
                    include: {
                        jtl_stock_summary: {
                            include: {
                                jtl_stocks: {
                                    include: {
                                        warehouse: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                days_until_restock: "asc",
            },
        });
        if (!products?.length) {
            console.log("No products that need restock");
            return;
        }
        const warehouses = lodash_1.default
            .uniqBy(products.flatMap((product) => product.jtl_product?.jtl_stock_summary?.jtl_stocks
            .flatMap((stock) => stock.warehouse)
            .filter((warehouse) => !!warehouse)), "warehouse_id")
            .sort((a, b) => (a.preferred ? -1 : 1));
        for (const warehouse of warehouses) {
            const productsInWarehouse = products.filter((product) => {
                const isInWarehouse = product.jtl_product?.jtl_stock_summary?.jtl_stocks?.some((stock) => stock.warehouse_id === warehouse.warehouse_id &&
                    stock.stockLevel >= (product.products_per_carton || 0));
                if (isInWarehouse) {
                    delete products[products.findIndex((p) => p.sellerSku === product.sellerSku)];
                }
                return isInWarehouse;
            });
            if (productsInWarehouse.length) {
                const shipment = await this.startShipmentCreation({
                    warehouse,
                    products: productsInWarehouse,
                });
            }
        }
    };
    static startShipmentCreation = async ({ warehouse, products, }) => {
        if (!(products[0].days_until_restock ?? 0 > 1) && !products[0]) {
            return;
        }
        const product = products[0];
        const productsWithShippingQty = [];
        productsWithShippingQty.push([
            product,
            this.getOptimizedProductInboundQuantity({
                product: product,
                warehouse,
                jtl_stock: product.jtl_product.jtl_stocks.find((stock) => stock.warehouse_id === warehouse.warehouse_id),
            }),
        ]);
        const bundlingProducts = products.slice(1);
        for (const bundlingProduct of bundlingProducts) {
            const qty = this.getBundledProductInboundQuantity({
                product: bundlingProduct,
                warehouse,
                jtl_stock: bundlingProduct.jtl_product.jtl_stocks.find((stock) => stock.warehouse_id === warehouse.warehouse_id),
            });
            if (qty) {
                productsWithShippingQty.push([bundlingProduct, qty]);
            }
        }
        console.log(productsWithShippingQty);
    };
    static recalibrateSalesVelocity = async ({ user, products, }) => {
        const apiConnection = await main_controller_1.prisma.apiConnection.findUnique({
            where: {
                apiconnection_id: {
                    company_id: user.company_id,
                    api_provider: client_1.ApiProvider.AMAZON_SELLER_CENTRAL,
                },
            },
        });
        const amazonProducts = await main_controller_1.prisma.$transaction(async (tx) => {
            const company = await tx.company.findUnique({
                where: {
                    company_id: user.company_id,
                },
            });
            console.log("Updating products", products.map((p) => p.sellerSku));
            const updatedProducts = await Promise.all(products.map(async (product) => {
                const salesVelocity = this.calculateSalesVelocity({
                    product,
                    velocityOptions: apiConnection?.amazon_settings ?? {},
                });
                const daysOnStock = salesVelocity && product.total_quantity !== null
                    ? lodash_1.default.round(product.total_quantity / salesVelocity, 2) ??
                        null
                    : null;
                const daysUntilRestock = salesVelocity && product.total_quantity !== null
                    ? lodash_1.default.round(Math.max(product.total_quantity / salesVelocity -
                        (company?.amazon_buffer_in_days ?? 0) -
                        (company?.amazon_inbound_lead_days ?? 0), 0), 2) ?? null
                    : null;
                const updatedProduct = await tx.amazonProduct.update({
                    where: {
                        owner_id_sellerSku: {
                            owner_id: user.company_id,
                            sellerSku: product.sellerSku,
                        },
                    },
                    data: {
                        sales_velocity: salesVelocity,
                        days_on_stock: daysOnStock,
                        days_until_restock: daysUntilRestock,
                    },
                });
                return updatedProduct;
            }));
            return updatedProducts;
        }, {
            maxWait: 20_000,
            timeout: 20_000,
        });
        return amazonProducts;
    };
    static getOptimizedProductInboundQuantity = ({ product: { costsPerDay: fba_inventory_costs_per_product_per_day = 0, unitVolume: sales_velocity = 0, days_on_stock = 0, days_until_restock = 0, products_per_carton = 1, total_quantity = 0, }, jtl_stock, warehouse, disableLowVolumeFee = false, }) => {
        const available_cartons = Math.floor(jtl_stock.stockLevel / products_per_carton);
        const inbound_fixed_cost = warehouse.outbound_fix_costs;
        let optimizedInboundQuantity = products_per_carton * 1;
        let minimumInventoryCostsPerItem = fba_inventory_costs_per_product_per_day *
            (optimizedInboundQuantity / sales_velocity) *
            0.5;
        let minimumFixedCostsPerItem = inbound_fixed_cost / optimizedInboundQuantity;
        let totalCostsPerItem = minimumInventoryCostsPerItem + minimumFixedCostsPerItem;
        for (let additionalCarton = 1; additionalCarton <
            available_cartons - optimizedInboundQuantity / products_per_carton; additionalCarton++) {
            const quantityWithAdditionalItems = additionalCarton * products_per_carton + optimizedInboundQuantity;
            const inventoryDurationWithAdditionalItems = quantityWithAdditionalItems / sales_velocity;
            const inventoryCostsWithAdditionalItems = 0.5 *
                fba_inventory_costs_per_product_per_day *
                inventoryDurationWithAdditionalItems;
            const fixedCostsPerItemWithAdditionalItems = inbound_fixed_cost / quantityWithAdditionalItems;
            const totalCostsPerItemWithAdditionalItems = inventoryCostsWithAdditionalItems +
                fixedCostsPerItemWithAdditionalItems;
            console.info("With add. cartons " +
                additionalCarton +
                " | " +
                lodash_1.default.round(totalCostsPerItemWithAdditionalItems, 3) +
                " vs " +
                lodash_1.default.round(totalCostsPerItem, 3));
            if (totalCostsPerItemWithAdditionalItems < totalCostsPerItem) {
                totalCostsPerItem = totalCostsPerItemWithAdditionalItems;
                optimizedInboundQuantity = quantityWithAdditionalItems;
                minimumFixedCostsPerItem = fixedCostsPerItemWithAdditionalItems;
                minimumInventoryCostsPerItem = inventoryCostsWithAdditionalItems;
            }
            else {
                break;
            }
        }
        const low_quantity_threshold = warehouse.outbound_low_quantity_costs_per === client_1.CalculationBasis.CARTON
            ? warehouse.outbound_low_quantity_costs_until
            : warehouse.outbound_low_quantity_costs_until / products_per_carton;
        const low_volume_fee_per_carton = warehouse.outbound_low_quantity_costs_per === client_1.CalculationBasis.CARTON
            ? warehouse.outbound_low_quantity_costs
            : warehouse.outbound_low_quantity_costs / products_per_carton;
        const low_volume_fee_per_product = low_volume_fee_per_carton / products_per_carton;
        const low_volume_fee_until_item_quantity = low_quantity_threshold * products_per_carton;
        if (!disableLowVolumeFee) {
            if (optimizedInboundQuantity < low_volume_fee_until_item_quantity) {
                totalCostsPerItem = totalCostsPerItem + low_volume_fee_per_product;
                const inventoryCostsPerItemsWhenExceedingLowVolumeFee = ((fba_inventory_costs_per_product_per_day *
                    low_volume_fee_until_item_quantity) /
                    sales_velocity) *
                    0.5;
                const fixedCostsPerItemWhenExceedingLowVolumeFee = inbound_fixed_cost / low_volume_fee_until_item_quantity;
                const totalCostsPerItemWhenExceedingLowVolumeFee = inventoryCostsPerItemsWhenExceedingLowVolumeFee +
                    fixedCostsPerItemWhenExceedingLowVolumeFee;
                console.info("Exceeding low volume fee comparison: " +
                    lodash_1.default.round(totalCostsPerItemWhenExceedingLowVolumeFee, 3) +
                    " vs " +
                    lodash_1.default.round(totalCostsPerItem, 3));
                if (totalCostsPerItemWhenExceedingLowVolumeFee < totalCostsPerItem) {
                    optimizedInboundQuantity = low_volume_fee_until_item_quantity;
                    totalCostsPerItem = totalCostsPerItemWhenExceedingLowVolumeFee;
                    minimumFixedCostsPerItem = fixedCostsPerItemWhenExceedingLowVolumeFee;
                    minimumInventoryCostsPerItem =
                        inventoryCostsPerItemsWhenExceedingLowVolumeFee;
                }
            }
        }
        console.info("totalCostsPerItem", lodash_1.default.round(totalCostsPerItem, 3));
        return optimizedInboundQuantity;
    };
    static getBundledProductInboundQuantity = ({ product, jtl_stock, warehouse, disableLowVolumeFee = false, }) => {
        const optimizedDefaultQuantity = this.getOptimizedProductInboundQuantity({
            product,
            jtl_stock,
            warehouse,
        });
        const inbound_fixed_cost_per_item = warehouse.outbound_fix_costs / optimizedDefaultQuantity;
        let optimizedQuantity = (inbound_fixed_cost_per_item * product.sales_velocity) /
            product.costsPerDay -
            product.days_until_restock * product.sales_velocity +
            0.5 * optimizedDefaultQuantity;
        optimizedQuantity = roundToNearest(optimizedQuantity, product.products_per_carton);
        const low_volume_fee_until_item_quantity = warehouse.outbound_low_quantity_costs_until * product.products_per_carton;
        const low_volume_fee_per_product = warehouse.outbound_low_quantity_costs_per === client_1.CalculationBasis.PRODUCT
            ? warehouse.outbound_low_quantity_costs
            : warehouse.outbound_low_quantity_costs / product.products_per_carton;
        const considerLowVolumeFees = optimizedQuantity < low_volume_fee_until_item_quantity &&
            optimizedDefaultQuantity > low_volume_fee_until_item_quantity;
        let optimizedQtyWithoutConsideringLowVolumeFees = optimizedQuantity;
        if (considerLowVolumeFees) {
            optimizedQuantity =
                optimizedQuantity -
                    (low_volume_fee_per_product * product.sales_velocity) /
                        product.costsPerDay;
            optimizedQuantity = roundToNearest(optimizedQuantity, product.products_per_carton);
            console.info("optimizedQuantity after accounting for low volume fees", optimizedQuantity);
        }
        (optimizedQuantity = Math.max(optimizedQuantity, 0)),
            product.products_per_carton;
        console.info("Consider low volume fees: ", considerLowVolumeFees);
        const savingsAgainstNoBundling = this.getSavingsAgainstNoBundling({
            optimizedQuantity,
            optimizedDefaultQuantity,
            ...product,
            ...warehouse,
            considerLowVolumeFees,
        });
        const savingsWithBundlingNotAccountingLowVolumeFees = considerLowVolumeFees
            ? -1 * savingsAgainstNoBundling
            : 0;
        console.info("SavingsAgainstNoBundling", savingsAgainstNoBundling);
        console.info("SavingsWithBundlingNotAccountingLowVolumeFees", savingsWithBundlingNotAccountingLowVolumeFees);
        console.info("optimizedQuantity", optimizedQuantity);
        return optimizedQuantity;
    };
    static getSavingsAgainstNoBundling = ({ optimizedQuantity, outbound_fix_costs, days_until_restock, costsPerDay, sales_velocity, optimizedDefaultQuantity, outbound_low_quantity_costs, considerLowVolumeFees, }) => {
        return (optimizedQuantity * outbound_fix_costs -
            optimizedQuantity * days_until_restock * costsPerDay -
            (0.5 * costsPerDay * Math.pow(optimizedQuantity, 2)) / sales_velocity -
            (0.5 *
                costsPerDay *
                optimizedDefaultQuantity *
                (optimizedDefaultQuantity - optimizedQuantity)) /
                sales_velocity +
            (0.5 * costsPerDay * Math.pow(optimizedDefaultQuantity, 2)) /
                sales_velocity -
            (considerLowVolumeFees
                ? outbound_low_quantity_costs * optimizedQuantity
                : 0));
    };
    static calculateSalesVelocity = ({ product: { unitsShippedT1, unitsShippedT3, unitsShippedT7, unitsShippedT30, unitsShippedT60, unitsShippedT90, }, velocityOptions: { t1, t3, t7, t30, t60, t90 }, }) => {
        if (unitsShippedT1 == null ||
            unitsShippedT3 == null ||
            unitsShippedT7 == null ||
            unitsShippedT30 == null) {
            return null;
        }
        const actualWeightT1 = t1 ?? 0;
        const actualWeightT3 = t3 ?? 0.45;
        const actualWeightT7 = t7 ?? 0.3;
        const actualWeightT30 = t30 ?? 0.25;
        const totalWeight = actualWeightT1 + actualWeightT3 + actualWeightT7 + actualWeightT30;
        const salesVelocity = lodash_1.default.round((unitsShippedT1 ?? 0) * actualWeightT1 +
            (unitsShippedT3 ?? 0) * (1 / 3) * actualWeightT3 +
            (unitsShippedT7 ?? 0) * (1 / 7) * actualWeightT7 +
            ((unitsShippedT30 ?? 0) * (1 / 30) * actualWeightT30) /
                totalWeight, 2);
        return salesVelocity;
    };
    static calculateDaysUntilRequiredRestock = ({ salesVelocity, currentInventory, stockBufferInDays, inboundShippingTimeInDays, }) => {
        return (currentInventory / salesVelocity -
            stockBufferInDays -
            inboundShippingTimeInDays);
    };
    static calculateUnitsShippedT = async ({ owner_id, sellerSku, planningData, tx, }) => {
        let prismaClient = tx ?? main_controller_1.prisma;
        const product = await prismaClient.amazonProduct.findUnique({
            where: {
                owner_id_sellerSku: {
                    sellerSku,
                    owner_id,
                },
            },
            ...(!planningData && {
                include: {
                    amazon_product_planning_data: true,
                },
            }),
        });
        if (!planningData) {
            planningData =
                product?.amazon_product_planning_data ?? undefined;
        }
        if (!planningData) {
            console.log("No planning data found");
        }
        const unitsShippedT60 = planningData?.unitsShippedT60 ?? 0;
        const unitsShippedT90 = planningData?.unitsShippedT90 ?? 0;
        const amazonProduct = await prismaClient.amazonProduct.update({
            where: {
                owner_id_sellerSku: {
                    sellerSku,
                    owner_id,
                },
            },
            data: {
                unitsShippedT60: Math.max(unitsShippedT60, product?.unitsShippedT30 || 0),
                unitsShippedT90: Math.max(unitsShippedT90, unitsShippedT60, product?.unitsShippedT30 ?? 0),
            },
        });
        return amazonProduct;
    };
}
exports.default = FbaInboundCalculator;
function roundToNearest(value, base) {
    return Math.round(value / base) * base;
}
//# sourceMappingURL=calculation.inbounds.js.map