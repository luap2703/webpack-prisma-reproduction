export type TheNotificatonTionVersionSchema = string;
export type TheNotificationTypeSchema = string;
export type ThePayloadVersionSchema = string;
export type TheEventTimeSchema = string;
export type TheApplicationIdSchema = string;
export type TheSubscriptionIdSchema = string;
export type ThePublishTimeSchema = string;
export type TheNotificationIdSchema = string;
export type TheSellerIdSchema = string;
export type TheMarketplaceIdSchema = string;
export type TheASINSchema = string;
export type TheItemConditionSchema = string;
export type TheTimeOfOfferChangeSchema = string;
export type TheOfferChangeTypeSchema = string;
export type PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesNumberOfOffersItems = TheFirstAnyOfSchema;
export type TheConditionSchema = string;
export type TheFulfillmentChannelSchema = string;
export type TheOfferCountSchema = number;
export type TheNumberOfOffersSchema = PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesNumberOfOffersItems[];
export type PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesLowestPricesItems = TheFirstAnyOfSchema1 | TheSecondAnyOfSchema;
export type TheConditionSchema1 = string;
export type TheFulfillmentChannelSchema1 = string;
export type TheAmountSchema = number;
export type TheCurrencyCodeSchema = string;
export type TheAmountSchema1 = number;
export type TheCurrencyCodeSchema1 = string;
export type TheAmountSchema2 = number;
export type TheCurrencyCodeSchema2 = string;
export type TheConditionSchema2 = string;
export type TheFulfillmentChannelSchema2 = string;
export type TheAmountSchema3 = number;
export type TheCurrencyCodeSchema3 = string;
export type TheAmountSchema4 = number;
export type TheCurrencyCodeSchema4 = string;
export type TheAmountSchema5 = number;
export type TheCurrencyCodeSchema5 = string;
export type ThePointsNumberSchema = number;
export type TheLowestPricesSchema = PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesLowestPricesItems[];
export type PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesBuyBoxPricesItems = TheFirstAnyOfSchema2 | TheSecondAnyOfSchema1;
export type TheConditionSchema3 = string;
export type TheAmountSchema6 = number;
export type TheCurrencyCodeSchema6 = string;
export type TheAmountSchema7 = number;
export type TheCurrencyCodeSchema7 = string;
export type TheAmountSchema8 = number;
export type TheCurrencyCodeSchema8 = string;
export type TheConditionSchema4 = string;
export type TheAmountSchema9 = number;
export type TheCurrencyCodeSchema9 = string;
export type TheAmountSchema10 = number;
export type TheCurrencyCodeSchema10 = string;
export type TheAmountSchema11 = number;
export type TheCurrencyCodeSchema11 = string;
export type ThePointsNumberSchema1 = number;
export type TheBuyBoxPricesSchema = PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesBuyBoxPricesItems[];
export type TheAmountSchema12 = number;
export type TheCurrencyCodeSchema12 = string;
export type TheAmountSchema13 = number;
export type TheCurrencyCodeSchema13 = string;
export type TheAmountSchema14 = number;
export type TheCurrencyCodeSchema14 = string;
export type TheTotalBuyBoxEligibleOffersSchema = number;
export type PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesSalesRankingsItems = TheFirstAnyOfSchema3;
export type TheProductCategoryIdSchema = string;
export type TheRankSchema = number;
export type TheSalesRankingsSchema = PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesSalesRankingsItems[];
export type PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesNumberOfBuyBoxEligibleOffersItems = TheFirstAnyOfSchema4;
export type TheConditionSchema5 = string;
export type TheFulfillmentChannelSchema3 = string;
export type TheOfferCountSchema1 = number;
export type TheNumberOfBuyBoxEligibleOffersSchema = PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesSummaryPropertiesNumberOfBuyBoxEligibleOffersItems[];
export type TheAmountSchema15 = number;
export type TheCurrencyCodeSchema15 = string;
export type PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesOffersItems = TheFirstAnyOfSchema5;
export type TheSellerIdSchema1 = string;
export type TheSubConditionSchema = string;
export type TheFeedbackCountSchema = number;
export type TheSellerPositiveFeedbackRatingSchema = number;
export type TheMinimumHoursSchema = number;
export type TheMaximumHoursSchema = number;
export type TheAvailabilityTypeSchema = string;
export type TheAvailableDateSchema = string;
export type TheAmountSchema16 = number;
export type TheCurrencyCodeSchema16 = string;
export type ThePointsNumberSchema2 = number;
export type TheAmountSchema17 = number;
export type TheCurrencyCodeSchema17 = string;
export type TheCountrySchema = string;
export type TheStateSchema = string;
export type TheIsFulfilledByAmazonSchema = boolean;
export type TheIsOfferPrimeSchema = boolean;
export type TheIsOfferNationalPrimeSchema = boolean;
export type TheIsExpeditedShippingAvailableSchema = boolean;
export type TheIsFeaturedMerchantSchema = boolean;
export type TheShipsDomesticallySchema = boolean;
export type TheShipsInternationallySchema = boolean;
export type TheOffersSchema = PropertiesPayloadPropertiesAnyOfferChangedNotificationPropertiesOffersItems[];
export interface AnyOfferChangedNotification {
    NotificatonTionVersion: TheNotificatonTionVersionSchema;
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
    AnyOfferChangedNotification: TheAnyOfferChangedNotificationSchema;
}
export interface TheAnyOfferChangedNotificationSchema {
    SellerId: TheSellerIdSchema;
    OfferChangeTrigger: TheOfferChangeTriggerSchema;
    Summary: TheSummarySchema;
    Offers: TheOffersSchema;
}
export interface TheOfferChangeTriggerSchema {
    MarketplaceId: TheMarketplaceIdSchema;
    ASIN: TheASINSchema;
    ItemCondition: TheItemConditionSchema;
    TimeOfOfferChange: TheTimeOfOfferChangeSchema;
    OfferChangeType: TheOfferChangeTypeSchema;
}
export interface TheSummarySchema {
    NumberOfOffers: TheNumberOfOffersSchema;
    LowestPrices: TheLowestPricesSchema;
    BuyBoxPrices: TheBuyBoxPricesSchema;
    ListPrice: TheListPriceSchema;
    MinimumAdvertisedPrice: TheMinimumAdvertisedPriceSchema;
    SuggestedLowerPricePlusShipping: TheSuggestedLowerPricePlusShippingSchema;
    TotalBuyBoxEligibleOffers: TheTotalBuyBoxEligibleOffersSchema;
    SalesRankings: TheSalesRankingsSchema;
    NumberOfBuyBoxEligibleOffers: TheNumberOfBuyBoxEligibleOffersSchema;
    CompetitivePriceThreshold: TheCompetitivePriceThresholdSchema;
}
export interface TheFirstAnyOfSchema {
    Condition: TheConditionSchema;
    FulfillmentChannel: TheFulfillmentChannelSchema;
    OfferCount: TheOfferCountSchema;
}
export interface TheFirstAnyOfSchema1 {
    Condition: TheConditionSchema1;
    FulfillmentChannel: TheFulfillmentChannelSchema1;
    LandedPrice: TheLandedPriceSchema;
    ListingPrice: TheListingPriceSchema;
    Shipping: TheShippingSchema;
}
export interface TheLandedPriceSchema {
    Amount: TheAmountSchema;
    CurrencyCode: TheCurrencyCodeSchema;
}
export interface TheListingPriceSchema {
    Amount: TheAmountSchema1;
    CurrencyCode: TheCurrencyCodeSchema1;
}
export interface TheShippingSchema {
    Amount: TheAmountSchema2;
    CurrencyCode: TheCurrencyCodeSchema2;
}
export interface TheSecondAnyOfSchema {
    Condition: TheConditionSchema2;
    FulfillmentChannel: TheFulfillmentChannelSchema2;
    LandedPrice: TheLandedPriceSchema1;
    ListingPrice: TheListingPriceSchema1;
    Shipping: TheShippingSchema1;
    Points: ThePointsSchema;
}
export interface TheLandedPriceSchema1 {
    Amount: TheAmountSchema3;
    CurrencyCode: TheCurrencyCodeSchema3;
}
export interface TheListingPriceSchema1 {
    Amount: TheAmountSchema4;
    CurrencyCode: TheCurrencyCodeSchema4;
}
export interface TheShippingSchema1 {
    Amount: TheAmountSchema5;
    CurrencyCode: TheCurrencyCodeSchema5;
}
export interface ThePointsSchema {
    PointsNumber: ThePointsNumberSchema;
}
export interface TheFirstAnyOfSchema2 {
    Condition: TheConditionSchema3;
    LandedPrice: TheLandedPriceSchema2;
    ListingPrice: TheListingPriceSchema2;
    Shipping: TheShippingSchema2;
}
export interface TheLandedPriceSchema2 {
    Amount: TheAmountSchema6;
    CurrencyCode: TheCurrencyCodeSchema6;
}
export interface TheListingPriceSchema2 {
    Amount: TheAmountSchema7;
    CurrencyCode: TheCurrencyCodeSchema7;
}
export interface TheShippingSchema2 {
    Amount: TheAmountSchema8;
    CurrencyCode: TheCurrencyCodeSchema8;
}
export interface TheSecondAnyOfSchema1 {
    Condition: TheConditionSchema4;
    LandedPrice: TheLandedPriceSchema3;
    ListingPrice: TheListingPriceSchema3;
    Shipping: TheShippingSchema3;
    Points: ThePointsSchema1;
}
export interface TheLandedPriceSchema3 {
    Amount: TheAmountSchema9;
    CurrencyCode: TheCurrencyCodeSchema9;
}
export interface TheListingPriceSchema3 {
    Amount: TheAmountSchema10;
    CurrencyCode: TheCurrencyCodeSchema10;
}
export interface TheShippingSchema3 {
    Amount: TheAmountSchema11;
    CurrencyCode: TheCurrencyCodeSchema11;
}
export interface ThePointsSchema1 {
    PointsNumber: ThePointsNumberSchema1;
}
export interface TheListPriceSchema {
    Amount: TheAmountSchema12;
    CurrencyCode: TheCurrencyCodeSchema12;
}
export interface TheMinimumAdvertisedPriceSchema {
    Amount: TheAmountSchema13;
    CurrencyCode: TheCurrencyCodeSchema13;
}
export interface TheSuggestedLowerPricePlusShippingSchema {
    Amount: TheAmountSchema14;
    CurrencyCode: TheCurrencyCodeSchema14;
}
export interface TheFirstAnyOfSchema3 {
    ProductCategoryId: TheProductCategoryIdSchema;
    Rank: TheRankSchema;
}
export interface TheFirstAnyOfSchema4 {
    Condition: TheConditionSchema5;
    FulfillmentChannel: TheFulfillmentChannelSchema3;
    OfferCount: TheOfferCountSchema1;
}
export interface TheCompetitivePriceThresholdSchema {
    Amount: TheAmountSchema15;
    CurrencyCode: TheCurrencyCodeSchema15;
}
export interface TheFirstAnyOfSchema5 {
    SellerId: TheSellerIdSchema1;
    SubCondition: TheSubConditionSchema;
    SellerFeedbackRating: TheSellerFeedbackRatingSchema;
    ShippingTime: TheShippingTimeSchema;
    ListingPrice: TheListingPriceSchema4;
    Points: ThePointsSchema2;
    Shipping: TheShippingSchema4;
    ShipsFrom: TheShipsFromSchema;
    IsFulfilledByAmazon: TheIsFulfilledByAmazonSchema;
    PrimeInformation: ThePrimeInformationSchema;
    IsExpeditedShippingAvailable: TheIsExpeditedShippingAvailableSchema;
    IsFeaturedMerchant: TheIsFeaturedMerchantSchema;
    ShipsDomestically: TheShipsDomesticallySchema;
    ShipsInternationally: TheShipsInternationallySchema;
}
export interface TheSellerFeedbackRatingSchema {
    FeedbackCount: TheFeedbackCountSchema;
    SellerPositiveFeedbackRating: TheSellerPositiveFeedbackRatingSchema;
}
export interface TheShippingTimeSchema {
    MinimumHours: TheMinimumHoursSchema;
    MaximumHours: TheMaximumHoursSchema;
    AvailabilityType: TheAvailabilityTypeSchema;
    AvailableDate: TheAvailableDateSchema;
}
export interface TheListingPriceSchema4 {
    Amount: TheAmountSchema16;
    CurrencyCode: TheCurrencyCodeSchema16;
}
export interface ThePointsSchema2 {
    PointsNumber: ThePointsNumberSchema2;
}
export interface TheShippingSchema4 {
    Amount: TheAmountSchema17;
    CurrencyCode: TheCurrencyCodeSchema17;
}
export interface TheShipsFromSchema {
    Country: TheCountrySchema;
    State: TheStateSchema;
}
export interface ThePrimeInformationSchema {
    IsOfferPrime: TheIsOfferPrimeSchema;
    IsOfferNationalPrime: TheIsOfferNationalPrimeSchema;
}
