export type PropertiesNotificationVersion = string;
export type PropertiesNotificationType = string;
export type PropertiesPayloadVersion = string;
export type PropertiesEventTime = string;
export type PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesSellerId = string;
export type PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesFeedId = string;
export type PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesFeedType = string;
export type PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesProcessingStatus = 'CANCELLED' | 'DONE' | 'FATAL';
export type PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesResultFeedDocumentId = string;
export type PropertiesNotificationMetadataPropertiesApplicationId = string;
export type PropertiesNotificationMetadataPropertiesSubscriptionId = string;
export type PropertiesNotificationMetadataPropertiesPublishTime = string;
export type PropertiesNotificationMetadataPropertiesNotificationId = string;
export interface FeedProcessingFinishedNotification {
    notificationVersion: PropertiesNotificationVersion;
    notificationType: PropertiesNotificationType;
    payloadVersion: PropertiesPayloadVersion;
    eventTime: PropertiesEventTime;
    payload: PropertiesPayload;
    notificationMetadata: PropertiesNotificationMetadata;
}
export interface PropertiesPayload {
    feedProcessingFinishedNotification: PropertiesPayloadPropertiesFeedProcessingFinishedNotification;
}
export interface PropertiesPayloadPropertiesFeedProcessingFinishedNotification {
    sellerId: PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesSellerId;
    feedId: PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesFeedId;
    feedType: PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesFeedType;
    processingStatus: PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesProcessingStatus;
    resultFeedDocumentId?: PropertiesPayloadPropertiesFeedProcessingFinishedNotificationPropertiesResultFeedDocumentId;
}
export interface PropertiesNotificationMetadata {
    applicationId: PropertiesNotificationMetadataPropertiesApplicationId;
    subscriptionId: PropertiesNotificationMetadataPropertiesSubscriptionId;
    publishTime: PropertiesNotificationMetadataPropertiesPublishTime;
    notificationId: PropertiesNotificationMetadataPropertiesNotificationId;
}
