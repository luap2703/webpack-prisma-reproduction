export type TheNotificationVersionSchema = string;
export type TheNotificationTypeSchema = string;
export type ThePayloadVersionSchema = string;
export type TheEventTimeSchema = string;
export type TheMarketplaceIdSchema = string;
export type TheBrandNameSchema = string;
export type TheAsinSchema = string;
export type ChangedItemAttributes = string[];
export type TheApplicationIdSchema = string;
export type TheSubscriptionIdSchema = string;
export type ThePublishTimeSchema = string;
export type TheNotificationIdSchema = string;
export interface BrandedItemContentChangeNotification {
    NotificationVersion: TheNotificationVersionSchema;
    NotificationType: TheNotificationTypeSchema;
    PayloadVersion: ThePayloadVersionSchema;
    EventTime: TheEventTimeSchema;
    Payload: ThePayloadSchema;
    NotificationMetadata: TheNotificationMetadataSchema;
}
export interface ThePayloadSchema {
    MarketplaceId: TheMarketplaceIdSchema;
    BrandName: TheBrandNameSchema;
    Asin: TheAsinSchema;
    AttributesChanged: ChangedItemAttributes;
}
export interface TheNotificationMetadataSchema {
    ApplicationId: TheApplicationIdSchema;
    SubscriptionId: TheSubscriptionIdSchema;
    PublishTime: ThePublishTimeSchema;
    NotificationId: TheNotificationIdSchema;
}
