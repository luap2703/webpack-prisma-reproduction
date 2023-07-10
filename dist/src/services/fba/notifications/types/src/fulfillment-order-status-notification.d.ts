export type TheNotificationVersionSchema = string;
export type TheNotificationTypeSchema = string;
export type ThePayloadVersionSchema = string;
export type TheEventTimeSchema = string;
export type TheSellerIdSchema = string;
export type TheEventTypeSchema = string;
export type TheStatusUpdatedDateTimeSchema = string;
export type TheSellerFulfillmentOrderIdSchema = string;
export type TheFulfillmentOrderStatusSchema = string;
export type TheFulfillmentShipmentStatusSchema = string;
export type TheAmazonShipmentIdSchema = string;
export type TheEstimatedArrivalDateTimeSchema = string;
export type TheFulfillmentShipmentPackagesSchema = TheFulfillmentShipmentPackagesSchema1 & TheFulfillmentShipmentPackagesSchema2;
export type ThePackageNumberSchema = number;
export type TheCarrierCodeSchema = string;
export type TheTrackingNumberSchema = string;
export type PropertiesPayloadPropertiesFulfillmentOrderStatusNotificationPropertiesFulfillmentShipmentPropertiesFulfillmentShipmentPackagesPropertiesFulfillmentShipmentPackageItem = TheFirstAnyOfSchema;
export type ThePackageNumberSchema1 = number;
export type TheCarrierCodeSchema1 = string;
export type TheTrackingNumberSchema1 = string;
export type TheFulfillmentShipmentPackagesSchema2 = PropertiesPayloadPropertiesFulfillmentOrderStatusNotificationPropertiesFulfillmentShipmentPropertiesFulfillmentShipmentPackagesPropertiesFulfillmentShipmentPackageItem[];
export type TheReceivedDateTimeSchema = string;
export type TheReturnedQuantitySchema = number;
export type TheSellerSKUSchema = string;
export type TheApplicationIdSchema = string;
export type TheSubscriptionIdSchema = string;
export type ThePublishTimeSchema = string;
export type TheNotificationIdSchema = string;
export interface FulfillmentOrderStatusNotification {
    NotificationVersion: TheNotificationVersionSchema;
    NotificationType: TheNotificationTypeSchema;
    PayloadVersion: ThePayloadVersionSchema;
    EventTime: TheEventTimeSchema;
    Payload: ThePayloadSchema;
    NotificationMetadata: TheNotificationMetadataSchema;
}
export interface ThePayloadSchema {
    FulfillmentOrderStatusNotification: TheFulfillmentOrderStatusNotificationSchema;
}
export interface TheFulfillmentOrderStatusNotificationSchema {
    SellerId: TheSellerIdSchema;
    EventType: TheEventTypeSchema;
    StatusUpdatedDateTime: TheStatusUpdatedDateTimeSchema;
    SellerFulfillmentOrderId: TheSellerFulfillmentOrderIdSchema;
    FulfillmentOrderStatus: TheFulfillmentOrderStatusSchema;
    FulfillmentShipment: TheFulfillmentShipmentSchema;
    FulfillmentReturnItem: TheFulfillmentReturnItemSchema;
}
export interface TheFulfillmentShipmentSchema {
    FulfillmentShipmentStatus: TheFulfillmentShipmentStatusSchema;
    AmazonShipmentId: TheAmazonShipmentIdSchema;
    EstimatedArrivalDateTime: TheEstimatedArrivalDateTimeSchema;
    FulfillmentShipmentPackages: TheFulfillmentShipmentPackagesSchema;
}
export interface TheFulfillmentShipmentPackagesSchema1 {
    FulfillmentShipmentPackageItem?: TheInfoSchema;
}
export interface TheInfoSchema {
    PackageNumber: ThePackageNumberSchema;
    CarrierCode: TheCarrierCodeSchema;
    TrackingNumber: TheTrackingNumberSchema;
}
export interface TheFirstAnyOfSchema {
    PackageNumber: ThePackageNumberSchema1;
    CarrierCode: TheCarrierCodeSchema1;
    TrackingNumber: TheTrackingNumberSchema1;
}
export interface TheFulfillmentReturnItemSchema {
    ReceivedDateTime: TheReceivedDateTimeSchema;
    ReturnedQuantity: TheReturnedQuantitySchema;
    SellerSKU: TheSellerSKUSchema;
}
export interface TheNotificationMetadataSchema {
    ApplicationId: TheApplicationIdSchema;
    SubscriptionId: TheSubscriptionIdSchema;
    PublishTime: ThePublishTimeSchema;
    NotificationId: TheNotificationIdSchema;
}
