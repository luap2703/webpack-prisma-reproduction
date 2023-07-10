export type NotificationVersion = string;
export type NotificationType = 'FBA_INVENTORY_AVAILABILITY_CHANGES';
export type PayloadVersion = string;
export type EventTime = string;
export type SellerId = string;
export type FNSKU = string;
export type ASIN = string;
export type SKU = string;
export type MarketplaceId = string;
export type ItemName = string;
export type Working = number;
export type Shipped = number;
export type Receiving = number;
export type Fulfillable = number;
export type Unfulfillable = number;
export type Researching = number;
export type WarehouseProcessing = number;
export type WarehouseTransfer = number;
export type PendingCustomerOrders = number;
export type FutureSupplyBuyable = number;
export type PendingCustomerOrderInTransit = number;
export type FulfillmentInventoryDetailsByMarketplace = Array<{
    MarketplaceId: MarketplaceId;
    ItemName: ItemName;
    FulfillmentInventory: FulfillmentInventoryDetails;
}>;
export interface FBAInventoryAvailabilityChangeNotification {
    NotificationVersion?: NotificationVersion;
    NotificationType?: NotificationType;
    PayloadVersion?: PayloadVersion;
    EventTime?: EventTime;
    Payload?: Payload;
}
export interface Payload {
    SellerId: SellerId;
    FNSKU: FNSKU;
    ASIN: ASIN;
    SKU: SKU;
    FulfillmentInventoryByMarketplace: FulfillmentInventoryDetailsByMarketplace;
}
export interface FulfillmentInventoryDetails {
    InboundQuantityBreakdown: InboundQuantityBreakdown;
    Fulfillable: Fulfillable;
    Unfulfillable: Unfulfillable;
    Researching: Researching;
    ReservedQuantityBreakdown: ReservedQuantityBreakdown;
    FutureSupplyBuyable: FutureSupplyBuyable;
    PendingCustomerOrderInTransit: PendingCustomerOrderInTransit;
}
export interface InboundQuantityBreakdown {
    Working: Working;
    Shipped: Shipped;
    Receiving: Receiving;
}
export interface ReservedQuantityBreakdown {
    WarehouseProcessing: WarehouseProcessing;
    WarehouseTransfer: WarehouseTransfer;
    PendingCustomerOrder: PendingCustomerOrders;
}
