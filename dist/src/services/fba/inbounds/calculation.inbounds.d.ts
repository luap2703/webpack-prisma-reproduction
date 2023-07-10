import { AmazonProduct, AmazonProductPlanningData, JTLConnectedWarehouse, JTLStock, JtlProduct, PrismaClient } from "@prisma/client";
export default class FbaInboundCalculator {
    static checkInventoryHealth: ({ user, }: {
        user: {
            company_id: string;
        };
    }) => Promise<void>;
    static startShipmentCreation: ({ warehouse, products, }: {
        warehouse: JTLConnectedWarehouse;
        products: (AmazonProduct & {
            jtl_product: JtlProduct & {
                jtl_stocks: JTLStock[];
            };
            isReady: boolean;
        })[];
    }) => Promise<void>;
    static recalibrateSalesVelocity: ({ user, products, }: {
        user: {
            company_id: string;
        };
        products: AmazonProduct[];
    }) => Promise<(import("@prisma/client/runtime").GetResult<{
        sellerSku: string;
        fnSku: string;
        asin: string;
        afnListingExists: boolean | null;
        inventoryDetails: import(".prisma/client").Prisma.JsonValue;
        condition: import(".prisma/client").AmazonProductCondition;
        productName: string;
        lastUpdatedTime: Date | null;
        images: import(".prisma/client").Prisma.JsonValue;
        created_at: Date;
        updated_at: Date;
        inventorySummary: import(".prisma/client").Prisma.JsonValue;
        catalogSummary: import(".prisma/client").Prisma.JsonValue;
        owner_id: string;
        jtl_sku: string | null;
        unitsShippedT1: number | null;
        unitsShippedT3: number | null;
        unitsShippedT7: number | null;
        unitsShippedT30: number | null;
        unitsShippedT60: number | null;
        unitsShippedT90: number | null;
        unitsShippedAll: number | null;
        costsPerDay: number | null;
        unitVolume: number | null;
        total_quantity: number | null;
        sales_velocity: number | null;
        days_on_stock: number | null;
        days_until_restock: number | null;
        products_per_carton: number | null;
        isEligibleForInboundShipments: boolean | null;
        isEligibleForInboundShipmentsErrors: import(".prisma/client").Prisma.JsonValue;
        isEligibleForCommingling: boolean | null;
        isEligibleForComminglingErrors: import(".prisma/client").Prisma.JsonValue;
    }, unknown, never> & {})[]>;
    static getOptimizedProductInboundQuantity: ({ product: { costsPerDay: fba_inventory_costs_per_product_per_day, unitVolume: sales_velocity, days_on_stock, days_until_restock, products_per_carton, total_quantity, }, jtl_stock, warehouse, disableLowVolumeFee, }: {
        product: {
            costsPerDay?: number | undefined;
            unitVolume?: number | undefined;
            total_quantity?: number | undefined;
            sales_velocity?: number | undefined;
            days_on_stock?: number | undefined;
            days_until_restock?: number | undefined;
            products_per_carton: number;
        };
        jtl_stock: JTLStock;
        warehouse: JTLConnectedWarehouse;
        disableLowVolumeFee?: boolean | undefined;
    }) => number;
    static getBundledProductInboundQuantity: ({ product, jtl_stock, warehouse, disableLowVolumeFee, }: {
        product: {
            costsPerDay: number;
            unitVolume: number;
            total_quantity: number;
            sales_velocity: number;
            days_on_stock: number;
            days_until_restock: number;
            products_per_carton: number;
        };
        jtl_stock: JTLStock;
        warehouse: JTLConnectedWarehouse;
        disableLowVolumeFee?: boolean | undefined;
    }) => number;
    static getSavingsAgainstNoBundling: ({ optimizedQuantity, outbound_fix_costs, days_until_restock, costsPerDay, sales_velocity, optimizedDefaultQuantity, outbound_low_quantity_costs, considerLowVolumeFees, }: {
        optimizedQuantity: number;
        outbound_fix_costs: number;
        days_until_restock: number;
        costsPerDay: number;
        sales_velocity: number;
        optimizedDefaultQuantity: number;
        outbound_low_quantity_costs: number;
        considerLowVolumeFees: boolean;
    }) => number;
    static calculateSalesVelocity: ({ product: { unitsShippedT1, unitsShippedT3, unitsShippedT7, unitsShippedT30, unitsShippedT60, unitsShippedT90, }, velocityOptions: { t1, t3, t7, t30, t60, t90 }, }: {
        product: Partial<AmazonProduct>;
        velocityOptions: VelocityOptions;
    }) => number | null;
    static calculateDaysUntilRequiredRestock: ({ salesVelocity, currentInventory, stockBufferInDays, inboundShippingTimeInDays, }: {
        salesVelocity: number;
        currentInventory: number;
        stockBufferInDays: number;
        inboundShippingTimeInDays: number;
    }) => number;
    static calculateUnitsShippedT: ({ owner_id, sellerSku, planningData, tx, }: {
        owner_id: string;
        sellerSku: string;
        planningData?: (import("@prisma/client/runtime").GetResult<{
            sellerSku: string;
            owner_id: string;
            snapshotDate: Date;
            available: number;
            pendingRemovalQuantity: number;
            invAge0To90Days: number;
            invAge91To180Days: number;
            invAge181To270Days: number;
            invAge271To365Days: number;
            invAge365PlusDays: number;
            currency: string;
            unitsShippedT7: number | null;
            unitsShippedT30: number | null;
            unitsShippedT60: number | null;
            unitsShippedT90: number | null;
            yourPrice: number;
            salesPrice: number;
            lowestPriceNewPlusShipping: number | null;
            lowestPriceUsed: number | null;
            recommendedAction: string;
            healthyInventoryLevel: number | null;
            recommendedSalesPrice: number | null;
            recommendedSaleDurationDays: number | null;
            recommendedRemovalQuantity: number | null;
            estimatedCostSavingsOfRecommendedActions: number | null;
            sellThrough: number | null;
            itemVolume: number;
            volumeUnitMeasurement: string;
            storageType: string | null;
            storageVolume: number | null;
            marketplace: string;
            productGroup: string;
            salesRank: number | null;
            daysOfSupply: number;
            estimatedExcessQuantity: number | null;
            weeksOfCoverT30: number | null;
            weeksOfCoverT90: number | null;
            featuredofferPrice: number | null;
            salesShippedLast7Days: number | null;
            salesShippedLast30Days: number | null;
            salesShippedLast60Days: number | null;
            salesShippedLast90Days: number | null;
            invAge0To30Days: number | null;
            invAge31To60Days: number | null;
            invAge61To90Days: number | null;
            invAge181To330Days: number | null;
            invAge331To365Days: number | null;
            estimatedStorageCostNextMonth: number | null;
            inboundQuantity: number;
            inboundWorking: number;
            inboundShipped: number;
            inboundReceived: number;
            reservedQuantity: number;
            unfulfillableQuantity: number;
            alert: string | null;
            report: import(".prisma/client").Prisma.JsonValue;
            updated_at: Date;
            created_at: Date;
        }, unknown, never> & {}) | undefined;
        tx?: PrismaClient | any;
    }) => Promise<import("@prisma/client/runtime").GetResult<{
        sellerSku: string;
        fnSku: string;
        asin: string;
        afnListingExists: boolean | null;
        inventoryDetails: import(".prisma/client").Prisma.JsonValue;
        condition: import(".prisma/client").AmazonProductCondition;
        productName: string;
        lastUpdatedTime: Date | null;
        images: import(".prisma/client").Prisma.JsonValue;
        created_at: Date;
        updated_at: Date;
        inventorySummary: import(".prisma/client").Prisma.JsonValue;
        catalogSummary: import(".prisma/client").Prisma.JsonValue;
        owner_id: string;
        jtl_sku: string | null;
        unitsShippedT1: number | null;
        unitsShippedT3: number | null;
        unitsShippedT7: number | null;
        unitsShippedT30: number | null;
        unitsShippedT60: number | null;
        unitsShippedT90: number | null;
        unitsShippedAll: number | null;
        costsPerDay: number | null;
        unitVolume: number | null;
        total_quantity: number | null;
        sales_velocity: number | null;
        days_on_stock: number | null;
        days_until_restock: number | null;
        products_per_carton: number | null;
        isEligibleForInboundShipments: boolean | null;
        isEligibleForInboundShipmentsErrors: import(".prisma/client").Prisma.JsonValue;
        isEligibleForCommingling: boolean | null;
        isEligibleForComminglingErrors: import(".prisma/client").Prisma.JsonValue;
    }, unknown, never> & {}>;
}
type VelocityOptions = {
    t1?: number;
    t3?: number;
    t7?: number;
    t30?: number;
    t60?: number;
    t90?: number;
};
export {};
