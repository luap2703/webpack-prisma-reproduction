export type NotificationVersion = string;
export type NotificationType = 'LISTINGS_ITEM_ISSUES_CHANGE';
export type PayloadVersion = string;
export type EventTime = string;
export type SellerID = string;
export type MarketplaceID = string;
export type ASIN = string;
export type SKU = string;
export type Severities = Array<'NONE' | 'ERROR' | 'WARNING'>;
export type EnforcementActionsTaken = Array<'SEARCH_SUPPRESSED'>;
export type ApplicationID = string;
export type SubscriptionID = string;
export type PublishTime = string;
export type NotificationID = string;
export interface ListingsItemIssuesChangeNotification {
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
    Severities: Severities;
    EnforcementActions?: EnforcementActionsTaken;
}
export interface NotificationMetadata {
    ApplicationId: ApplicationID;
    SubscriptionId: SubscriptionID;
    PublishTime: PublishTime;
    NotificationId: NotificationID;
}
