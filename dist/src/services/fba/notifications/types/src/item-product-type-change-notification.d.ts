export type TheNotificationVersionSchema = string;
export type TheNotificationTypeSchema = string;
export type ThePayloadVersionSchema = string;
export type TheEventTimeSchema = string;
export type TheMarketplaceIdSchema = string;
export type TheAsinSchema = string;
export type ThePreviousProductTypeSchema = string;
export type TheCurrentProductTypeSchema = string;
export type TheApplicationIdSchema = string;
export type TheSubscriptionIdSchema = string;
export type ThePublishTimeSchema = string;
export type TheNotificationIdSchema = string;
export interface ItemProductTypeChangeNotification {
    NotificationVersion: TheNotificationVersionSchema;
    NotificationType: TheNotificationTypeSchema;
    PayloadVersion: ThePayloadVersionSchema;
    EventTime: TheEventTimeSchema;
    Payload: ThePayloadSchema;
    NotificationMetadata: TheNotificationMetadataSchema;
}
export interface ThePayloadSchema {
    MarketplaceId: TheMarketplaceIdSchema;
    Asin: TheAsinSchema;
    PreviousProductType: ThePreviousProductTypeSchema;
    CurrentProductType: TheCurrentProductTypeSchema;
}
export interface TheNotificationMetadataSchema {
    ApplicationId: TheApplicationIdSchema;
    SubscriptionId: TheSubscriptionIdSchema;
    PublishTime: ThePublishTimeSchema;
    NotificationId: TheNotificationIdSchema;
}
