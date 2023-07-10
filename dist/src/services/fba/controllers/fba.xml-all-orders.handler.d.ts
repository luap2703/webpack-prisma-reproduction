import { ReportProcessingFinishedNotification } from "src/services/fba/notifications/types/src";
export declare const handleXMLAllOrdersReport: (data: ReportProcessingFinishedNotification) => Promise<void>;
interface Order {
    AmazonOrderID: string;
    MerchantOrderID: string;
    PurchaseDate: string;
    LastUpdatedDate: string;
    OrderStatus: string;
    SalesChannel: string;
    FulfillmentData: {
        FulfillmentChannel: string;
        ShipServiceLevel: string;
        Address: object;
    };
    IsBusinessOrder: boolean;
    IsIba: boolean;
    OrderItem: OrderItem | OrderItem[];
}
interface OrderItem {
    AmazonOrderItemCode: number;
    ASIN: string;
    SKU: string;
    ItemStatus: string;
    ProductName: string;
    Quantity: number;
    ItemPrice: object;
}
interface AggregatedView {
    asin: string;
    unitsShippedT1: number;
    unitsShippedT3: number;
    unitsShippedT7: number;
    unitsShippedT30: number;
    unitsShippedAll: number;
}
export declare function generateAggregatedView(orders: Order[]): AggregatedView[];
export {};
