export type PropertiesNotificationVersion = string;
export type PropertiesNotificationType = string;
export type PropertiesPayloadVersion = string;
export type PropertiesEventTime = string;
export type PropertiesNotificationMetadataPropertiesApplicationId = string;
export type PropertiesNotificationMetadataPropertiesSubscriptionId = string;
export type PropertiesNotificationMetadataPropertiesPublishTime = string;
export type PropertiesNotificationMetadataPropertiesNotificationId = string;
export type PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotificationPropertiesSellerId = string;
export type PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotificationPropertiesAmazonOrderId = string;
export type PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotificationPropertiesAmazonShipmentId = string;
export type PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotificationPropertiesShipmentStatus = string;
export interface FBAOutboundShipmentStatusNotification {
    NotificationVersion: PropertiesNotificationVersion;
    NotificationType: PropertiesNotificationType;
    PayloadVersion: PropertiesPayloadVersion;
    EventTime: PropertiesEventTime;
    NotificationMetadata: PropertiesNotificationMetadata;
    Payload: PropertiesPayload;
}
export interface PropertiesNotificationMetadata {
    ApplicationId: PropertiesNotificationMetadataPropertiesApplicationId;
    SubscriptionId: PropertiesNotificationMetadataPropertiesSubscriptionId;
    PublishTime: PropertiesNotificationMetadataPropertiesPublishTime;
    NotificationId: PropertiesNotificationMetadataPropertiesNotificationId;
}
export interface PropertiesPayload {
    FBAOutboundShipmentStatusNotification: PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotification;
}
export interface PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotification {
    SellerId: PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotificationPropertiesSellerId;
    AmazonOrderId: PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotificationPropertiesAmazonOrderId;
    AmazonShipmentId: PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotificationPropertiesAmazonShipmentId;
    ShipmentStatus: PropertiesPayloadPropertiesFBAOutboundShipmentStatusNotificationPropertiesShipmentStatus;
}
