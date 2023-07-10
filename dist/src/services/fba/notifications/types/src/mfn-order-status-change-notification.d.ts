export type TheNotificationVersionSchema = string;
export type TheNotificationTypeSchema = string;
export type ThePayloadVersionSchema = string;
export type TheEventTimeSchema = string;
export type TheSellerIdSchema = string;
export type TheMarketplaceIdSchema = string;
export type TheAmazonOrderIdSchema = string;
export type ThePurchaseDateSchema = number | null;
export type TheOrderStatusSchema = string;
export type TheDestinationPostalCodeSchema = string | null;
export type TheSupplySourceIdSchema = string | null;
export type TheOrderItemIdSchema = string;
export type TheSellerSKUSchema = string;
export type TheQuantitySchema = number;
export type TheApplicationIdSchema = string;
export type TheSubscriptionIdSchema = string;
export type ThePublishTimeSchema = string;
export type TheNotificationIdSchema = string;
export interface MfnOrderStatusChangeNotification {
    NotificationVersion: TheNotificationVersionSchema;
    NotificationType: TheNotificationTypeSchema;
    PayloadVersion: ThePayloadVersionSchema;
    EventTime: TheEventTimeSchema;
    Payload: ThePayloadSchema;
    NotificationMetadata: TheNotificationMetadataSchema;
}
export interface ThePayloadSchema {
    MFNOrderStatusChangeNotification: TheMFNOrderStatusChangeNotificationSchema;
}
export interface TheMFNOrderStatusChangeNotificationSchema {
    SellerId: TheSellerIdSchema;
    MarketplaceId: TheMarketplaceIdSchema;
    AmazonOrderId: TheAmazonOrderIdSchema;
    PurchaseDate: ThePurchaseDateSchema;
    OrderStatus: TheOrderStatusSchema;
    DestinationPostalCode: TheDestinationPostalCodeSchema;
    SupplySourceId: TheSupplySourceIdSchema;
    OrderItemId: TheOrderItemIdSchema;
    SellerSKU: TheSellerSKUSchema;
    Quantity: TheQuantitySchema;
}
export interface TheNotificationMetadataSchema {
    ApplicationId: TheApplicationIdSchema;
    SubscriptionId: TheSubscriptionIdSchema;
    PublishTime: ThePublishTimeSchema;
    NotificationId: TheNotificationIdSchema;
}
