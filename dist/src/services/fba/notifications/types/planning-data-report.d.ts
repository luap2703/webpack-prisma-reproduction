export interface PlanningDataReport {
    rows: AmazonProductPlanningData[];
}
export interface AmazonProductPlanningData {
    snapshotDate: Date;
    sku: string;
    fnsku: string;
    asin: string;
    productName: string;
    condition: Condition;
    available: number;
    pendingRemovalQuantity: number;
    invAge0To90Days: number;
    invAge91To180Days: number;
    invAge181To270Days: number;
    invAge271To365Days: number;
    invAge365PlusDays: number;
    currency: Currency;
    unitsShippedT7: number;
    unitsShippedT30: number;
    unitsShippedT60: number;
    unitsShippedT90: number;
    yourPrice: number;
    salesPrice: number;
    lowestPriceNewPlusShipping: number;
    lowestPriceUsed: number;
    recommendedAction: string;
    healthyInventoryLevel?: number;
    recommendedSalesPrice?: number;
    recommendedSaleDurationDays?: number;
    recommendedRemovalQuantity?: number;
    estimatedCostSavingsOfRecommendedActions?: number;
    sellThrough: number;
    itemVolume: number;
    volumeUnitMeasurement: VolumeUnitMeasurement;
    storageType: StorageType;
    storageVolume: number;
    marketplace: Marketplace;
    productGroup: ProductGroup;
    salesRank?: number;
    daysOfSupply: number;
    estimatedExcessQuantity: number;
    weeksOfCoverT30?: number;
    weeksOfCoverT90?: number;
    featuredofferPrice: number;
    salesShippedLast7Days?: number;
    salesShippedLast30Days?: number;
    salesShippedLast60Days?: number;
    salesShippedLast90Days?: number;
    invAge0To30Days: number;
    invAge31To60Days: number;
    invAge61To90Days: number;
    invAge181To330Days: number;
    invAge331To365Days: number;
    estimatedStorageCostNextMonth?: number;
    inboundQuantity: number;
    inboundWorking: number;
    inboundShipped: number;
    inboundReceived: number;
    reservedQuantity: number;
    unfulfillableQuantity: number;
    alert?: string;
}
export declare enum Condition {
    New = "New"
}
export declare enum Currency {
    Eur = "EUR"
}
export declare enum Marketplace {
    De = "DE"
}
export declare enum ProductGroup {
    GlHome = "gl_home",
    GlHomeImprovement = "gl_home_improvement"
}
export declare enum StorageType {
    Standard = "Standard"
}
export declare enum VolumeUnitMeasurement {
    CubicMeter = "cubic meter"
}
