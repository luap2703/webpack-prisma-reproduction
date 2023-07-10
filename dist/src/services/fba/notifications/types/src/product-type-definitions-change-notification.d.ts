export type TheNotificationVersionSchema = string;
export type TheNotificationTypeSchema = string;
export type ThePayloadVersionSchema = string;
export type TheEventTimeSchema = string;
export type TheMarketplaceIdSchema = string;
export type TheMerchantIdOrVendorGroupId = string;
export type TheVersionOfLatestProductTypeDefinitions = string;
export type NewProductTypes = NewProductTypes1 & NewProductTypes2;
export type NewProductTypes1 = string;
export type NewProductTypes2 = unknown[];
export type TheApplicationIdSchema = string;
export type TheSubscriptionIdSchema = string;
export type ThePublishTimeSchema = string;
export type TheNotificationIdSchema = string;
export interface ProductTypeDefinitionsChangeNotification {
    NotificationVersion: TheNotificationVersionSchema;
    NotificationType: TheNotificationTypeSchema;
    PayloadVersion: ThePayloadVersionSchema;
    EventTime: TheEventTimeSchema;
    Payload: ThePayloadSchema;
    NotificationMetadata: TheNotificationMetadataSchema;
}
export interface ThePayloadSchema {
    MarketplaceId?: TheMarketplaceIdSchema;
    AccountId: TheMerchantIdOrVendorGroupId;
    ProductTypeVersion: TheVersionOfLatestProductTypeDefinitions;
    NewProductTypes?: NewProductTypes;
}
export interface TheNotificationMetadataSchema {
    ApplicationId: TheApplicationIdSchema;
    SubscriptionId: TheSubscriptionIdSchema;
    PublishTime: ThePublishTimeSchema;
    NotificationId: TheNotificationIdSchema;
}
