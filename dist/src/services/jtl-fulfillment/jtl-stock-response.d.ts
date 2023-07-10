export interface JtlStockResponse {
    jfsku: string;
    stockLevel: number;
    stockLevelReserved: number;
    stockLevelBlocked: number;
    stockLevelAnnounced: number;
    stockLevelDetails: StockLevelDetail[];
    stockReservedDetails: StockReservedDetail[];
    stockAnnouncedDetails: StockAnnouncedDetail[];
    warehouses?: JtlStockResponse[];
    fulfiller?: JtlStockResponse[];
    merchantSku: string;
    fulfillerTimestamp?: Date;
    fulfillerId?: string;
    warehouseId?: string;
}
export interface StockAnnouncedDetail {
    inboundId: string;
    inboundItemId: string;
    quantityAnnounced: number;
}
export interface StockLevelDetail {
    batch: string;
    bestBefore: BestBefore;
    stockLevel: number;
    stockLevelBlocked: number;
}
export interface BestBefore {
    year: number;
    month: number;
    day: number;
}
export interface StockReservedDetail {
    outboundId: string;
    outboundItemId: string;
    quantityReserved: number;
}
