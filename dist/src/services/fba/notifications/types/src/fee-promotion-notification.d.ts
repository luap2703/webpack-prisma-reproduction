export type TheNotificationVersionSchema = string;
export type TheNotificationTypeSchema = string;
export type ThePayloadVersionSchema = string;
export type TheEventTimeSchema = string;
export type TheApplicationIdSchema = string;
export type TheSubscriptionIdSchema = string;
export type ThePublishTimeSchema = string;
export type TheNotificationIdSchema = string;
export type TheMerchantIdSchema = string;
export type TheMarketplaceIdSchema = string;
export type TheFeePromotionTypeSchema = string;
export type TheFeePromotionTypeDescriptionSchema = string;
export type TheEffectiveFromDateSchema = string;
export type TheEffectiveThroughDateSchema = string;
export type PropertiesPayloadPropertiesFeePromotionNotificationPropertiesIdentifiersItems = TheFirstAnyOfSchema;
export type TheIdentifierTypeSchema = string;
export type PropertiesPayloadPropertiesFeePromotionNotificationPropertiesIdentifiersItemsAnyOf0PropertiesIdentifierValuesItems = TheFirstAnyOfSchema1;
export type TheIdentifierValueIdSchema = string;
export type TheIdentifierValueFriendlyNameSchema = string;
export type TheIdentifierValuesSchema = PropertiesPayloadPropertiesFeePromotionNotificationPropertiesIdentifiersItemsAnyOf0PropertiesIdentifierValuesItems[];
export type TheIdentifiersSchema = PropertiesPayloadPropertiesFeePromotionNotificationPropertiesIdentifiersItems[];
export type PropertiesPayloadPropertiesFeePromotionNotificationPropertiesPromotionInformationItems = TheFirstAnyOfSchema2;
export type TheFeeTypeSchema = string;
export type TheFeeDiscountTypeSchema = string;
export type TheFeeDiscountValueSchema = number;
export type TheAmountSchema = number;
export type TheCurrencyCodeSchema = string;
export type TheAmountSchema1 = number;
export type TheCurrencyCodeSchema1 = string;
export type TheTimeOfFeesEstimatedSchema = string;
export type TheAmountSchema2 = number;
export type TheCurrencyCodeSchema2 = string;
export type PropertiesPayloadPropertiesFeePromotionNotificationPropertiesPromotionInformationItemsAnyOf0PropertiesFeesEstimatePropertiesFeeDetailsItems = TheFirstAnyOfSchema3;
export type TheFeeTypeSchema1 = string;
export type TheAmountSchema3 = number;
export type TheCurrencyCodeSchema3 = string;
export type TheAmountSchema4 = number;
export type TheCurrencyCodeSchema4 = string;
export type TheAmountSchema5 = number;
export type TheCurrencyCodeSchema5 = string;
export type TheAmountSchema6 = number;
export type TheCurrencyCodeSchema6 = string;
export type PropertiesPayloadPropertiesFeePromotionNotificationPropertiesPromotionInformationItemsAnyOf0PropertiesFeesEstimatePropertiesFeeDetailsItemsAnyOf0PropertiesIncludedFeesItems = TheFirstAnyOfSchema4;
export type TheFeeTypeSchema2 = string;
export type TheAmountSchema7 = number;
export type TheCurrencyCodeSchema7 = string;
export type TheAmountSchema8 = number;
export type TheCurrencyCodeSchema8 = string;
export type TheAmountSchema9 = number;
export type TheCurrencyCodeSchema9 = string;
export type TheAmountSchema10 = number;
export type TheCurrencyCodeSchema10 = string;
export type TheIncludedFeesSchema = PropertiesPayloadPropertiesFeePromotionNotificationPropertiesPromotionInformationItemsAnyOf0PropertiesFeesEstimatePropertiesFeeDetailsItemsAnyOf0PropertiesIncludedFeesItems[];
export type TheFeeDetailsSchema = PropertiesPayloadPropertiesFeePromotionNotificationPropertiesPromotionInformationItemsAnyOf0PropertiesFeesEstimatePropertiesFeeDetailsItems[];
export type ThePromotionInformationSchema = PropertiesPayloadPropertiesFeePromotionNotificationPropertiesPromotionInformationItems[];
export interface FeePromotionNotification {
    NotificationVersion: TheNotificationVersionSchema;
    NotificationType: TheNotificationTypeSchema;
    PayloadVersion: ThePayloadVersionSchema;
    EventTime: TheEventTimeSchema;
    NotificationMetadata: TheNotificationMetadataSchema;
    Payload: ThePayloadSchema;
}
export interface TheNotificationMetadataSchema {
    ApplicationId: TheApplicationIdSchema;
    SubscriptionId: TheSubscriptionIdSchema;
    PublishTime: ThePublishTimeSchema;
    NotificationId: TheNotificationIdSchema;
}
export interface ThePayloadSchema {
    FeePromotionNotification: TheFeePromotionNotificationSchema;
}
export interface TheFeePromotionNotificationSchema {
    MerchantId: TheMerchantIdSchema;
    MarketplaceId: TheMarketplaceIdSchema;
    FeePromotionType: TheFeePromotionTypeSchema;
    FeePromotionTypeDescription: TheFeePromotionTypeDescriptionSchema;
    PromotionActiveTimeRange: ThePromotionActiveTimeRangeSchema;
    Identifiers: TheIdentifiersSchema;
    PromotionInformation: ThePromotionInformationSchema;
}
export interface ThePromotionActiveTimeRangeSchema {
    EffectiveFromDate: TheEffectiveFromDateSchema;
    EffectiveThroughDate: TheEffectiveThroughDateSchema;
}
export interface TheFirstAnyOfSchema {
    IdentifierType: TheIdentifierTypeSchema;
    IdentifierValues: TheIdentifierValuesSchema;
}
export interface TheFirstAnyOfSchema1 {
    IdentifierValueId: TheIdentifierValueIdSchema;
    IdentifierValueFriendlyName: TheIdentifierValueFriendlyNameSchema;
}
export interface TheFirstAnyOfSchema2 {
    FeeType: TheFeeTypeSchema;
    FeeDiscountType: TheFeeDiscountTypeSchema;
    FeeDiscountValue: TheFeeDiscountValueSchema;
    PriceThreshold: ThePriceThresholdSchema;
    FeeDiscountMonetaryAmount: TheFeeDiscountMonetaryAmountSchema;
    FeesEstimate: TheFeesEstimateSchema;
}
export interface ThePriceThresholdSchema {
    Amount: TheAmountSchema;
    CurrencyCode: TheCurrencyCodeSchema;
}
export interface TheFeeDiscountMonetaryAmountSchema {
    Amount: TheAmountSchema1;
    CurrencyCode: TheCurrencyCodeSchema1;
}
export interface TheFeesEstimateSchema {
    TimeOfFeesEstimated: TheTimeOfFeesEstimatedSchema;
    TotalFeesEstimate: TheTotalFeesEstimateSchema;
    FeeDetails: TheFeeDetailsSchema;
}
export interface TheTotalFeesEstimateSchema {
    Amount: TheAmountSchema2;
    CurrencyCode: TheCurrencyCodeSchema2;
}
export interface TheFirstAnyOfSchema3 {
    FeeType: TheFeeTypeSchema1;
    FeeAmount: TheFeeAmountSchema;
    TaxAmount: TheTaxAmountSchema;
    FeePromotion: TheFeePromotionSchema;
    FinalFee: TheFinalFeeSchema;
    IncludedFees: TheIncludedFeesSchema;
}
export interface TheFeeAmountSchema {
    Amount: TheAmountSchema3;
    CurrencyCode: TheCurrencyCodeSchema3;
}
export interface TheTaxAmountSchema {
    Amount: TheAmountSchema4;
    CurrencyCode: TheCurrencyCodeSchema4;
}
export interface TheFeePromotionSchema {
    Amount: TheAmountSchema5;
    CurrencyCode: TheCurrencyCodeSchema5;
}
export interface TheFinalFeeSchema {
    Amount: TheAmountSchema6;
    CurrencyCode: TheCurrencyCodeSchema6;
}
export interface TheFirstAnyOfSchema4 {
    FeeType: TheFeeTypeSchema2;
    FeeAmount: TheFeeAmountSchema1;
    TaxAmount: TheTaxAmountSchema1;
    FeePromotion: TheFeePromotionSchema1;
    FinalFee: TheFinalFeeSchema1;
}
export interface TheFeeAmountSchema1 {
    Amount: TheAmountSchema7;
    CurrencyCode: TheCurrencyCodeSchema7;
}
export interface TheTaxAmountSchema1 {
    Amount: TheAmountSchema8;
    CurrencyCode: TheCurrencyCodeSchema8;
}
export interface TheFeePromotionSchema1 {
    Amount: TheAmountSchema9;
    CurrencyCode: TheCurrencyCodeSchema9;
}
export interface TheFinalFeeSchema1 {
    Amount: TheAmountSchema10;
    CurrencyCode: TheCurrencyCodeSchema10;
}
