export type PropertiesNotificationVersion = string;
export type PropertiesNotificationType = string;
export type PropertiesPayloadVersion = string;
export type PropertiesEventTime = string;
export type PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesSellerId = string;
export type PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesReportId = string;
export type PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesReportType = string;
export type PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesProcessingStatus = 'CANCELLED' | 'DONE' | 'FATAL';
export type PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesReportDocumentId = string;
export type PropertiesNotificationMetadataPropertiesApplicationId = string;
export type PropertiesNotificationMetadataPropertiesSubscriptionId = string;
export type PropertiesNotificationMetadataPropertiesPublishTime = string;
export type PropertiesNotificationMetadataPropertiesNotificationId = string;
export interface ReportProcessingFinishedNotification {
    notificationVersion: PropertiesNotificationVersion;
    notificationType: PropertiesNotificationType;
    payloadVersion: PropertiesPayloadVersion;
    eventTime: PropertiesEventTime;
    payload: PropertiesPayload;
    notificationMetadata: PropertiesNotificationMetadata;
}
export interface PropertiesPayload {
    reportProcessingFinishedNotification: PropertiesPayloadPropertiesReportProcessingFinishedNotification;
}
export interface PropertiesPayloadPropertiesReportProcessingFinishedNotification {
    sellerId: PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesSellerId;
    reportId: PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesReportId;
    reportType: PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesReportType;
    processingStatus: PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesProcessingStatus;
    reportDocumentId?: PropertiesPayloadPropertiesReportProcessingFinishedNotificationPropertiesReportDocumentId;
}
export interface PropertiesNotificationMetadata {
    applicationId: PropertiesNotificationMetadataPropertiesApplicationId;
    subscriptionId: PropertiesNotificationMetadataPropertiesSubscriptionId;
    publishTime: PropertiesNotificationMetadataPropertiesPublishTime;
    notificationId: PropertiesNotificationMetadataPropertiesNotificationId;
}
