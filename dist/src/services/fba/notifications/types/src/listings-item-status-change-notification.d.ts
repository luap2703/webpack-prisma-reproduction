export type NotificationVersion = string;
export type NotificationType = 'LISTINGS_ITEM_STATUS_CHANGED';
export type PayloadVersion = string;
export type EventTime = string;
export type SellerID = string;
export type MarketplaceID = string;
export type ASIN = string;
export type SKU = string;
export type CreatedDate = string;
export type Status = Array<'BUYABLE' | 'DISCOVERABLE' | 'DELETED'>;
export type ApplicationID = string;
export type SubscriptionID = string;
export type PublishTime = string;
export type NotificationID = string;
export interface ListingsItemStatusChangeNotification {
    NotificationVersion: NotificationVersion;
    NotificationType: NotificationType;
    PayloadVersion: PayloadVersion;
    EventTime: EventTime;
    Payload: Payload;
    NotificationMetadata: NotificationMetadata;
}
export interface Payload {
    SellerId: SellerID;
    MarketplaceId?: MarketplaceID;
    Asin?: ASIN;
    Sku: SKU;
    CreatedDate?: CreatedDate;
    Status: Status;
}
export interface NotificationMetadata {
    ApplicationId: ApplicationID;
    SubscriptionId: SubscriptionID;
    PublishTime: PublishTime;
    NotificationId: NotificationID;
}
