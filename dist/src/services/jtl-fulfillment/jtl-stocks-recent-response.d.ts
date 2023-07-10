export interface JtlStocksRecentResponse {
    nextChunkUrl: string;
    from: Date;
    to: Date;
    data: StockItem[];
    moreDataAvailable: boolean;
}
export interface StockItem {
    stockChangeId: StockChangeID;
    fulfillerStockChangeId: string;
    stockLevel: number;
    stockLevelReserved: number;
    stockLevelBlocked: number;
    stockLevelAnnounced: number;
    quantity: number;
    quantityReserved: number;
    quantityBlocked: number;
    quantityAnnounced: number;
    batch: string;
    bestBefore: BestBefore;
    changeType: string;
    outboundItem: OutboundItem;
    inboundItem: InboundItem;
    returnItem: ReturnItem;
    outboundShippingNotificationItem: OutboundShippingNotificationItem;
    note: string;
    current: boolean;
    modificationInfo: ModificationInfo;
    merchantSku: string;
    fulfillerTimestamp: Date;
}
export interface BestBefore {
    year: number;
    month: number;
    day: number;
}
export interface InboundItem {
    merchantInboundNumber: string;
    inboundItemId: string;
    inboundId: string;
}
export interface ModificationInfo {
    createdAt: Date;
    updatedAt: Date;
    state: string;
    changesInRange: ChangesInRange[];
}
export interface ChangesInRange {
}
export interface OutboundItem {
    merchantOutboundNumber: string;
    outboundItemId: string;
    outboundId: string;
}
export interface OutboundShippingNotificationItem {
    outboundShippingNotificationId: string;
    outboundShippingNotificationItemId: string;
}
export interface ReturnItem {
    returnId: string;
    returnItemId: string;
}
export interface StockChangeID {
    warehouseId: string;
    jfsku: string;
    stockVersion: number;
}
