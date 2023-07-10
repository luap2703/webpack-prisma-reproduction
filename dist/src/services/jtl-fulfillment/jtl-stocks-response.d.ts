export interface JtlStocksResponse {
    items: ProductStockItem[];
    _page: Page;
    _links: Links;
    nextPageLink: string;
    count: number;
}
export interface Links {
    previous: string;
    next: string;
}
export interface Page {
    total: number;
    limit: number;
    offset: number;
}
export interface ProductStockItem {
    jfsku: string;
    stockLevel: number;
    stockLevelReserved: number;
    stockLevelBlocked: number;
    stockLevelAnnounced: number;
    stockLevelDetails: StockLevelDetail[];
    stockReservedDetails: StockReservedDetail[];
    stockAnnouncedDetails: StockAnnouncedDetail[];
    warehouses: WarehouseProductStockItem[];
    fulfiller: ProductStockItem[];
    merchantSku: string;
    fulfillerTimestamp?: Date;
}
export interface WarehouseProductStockItem {
    jfsku: string;
    stockLevel: number;
    stockLevelReserved: number;
    stockLevelBlocked: number;
    stockLevelAnnounced: number;
    stockLevelDetails: StockLevelDetail[];
    stockReservedDetails: StockReservedDetail[];
    stockAnnouncedDetails: StockAnnouncedDetail[];
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
