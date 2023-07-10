import { JTLShippingMethodType } from "@prisma/client";
export interface JtlShippingMethodsResponse {
    items: JtlShippingMethod[];
    _page: Page;
    _links: Links;
    nextPageLink: string;
    count: number;
}
export interface Links {
    previous: string;
    next: string;
}
export interface Page {
    total: number;
    limit: number;
    offset: number;
}
export interface JtlShippingMethod {
    shippingMethodId: string;
    name: string;
    fulfillerId: string;
    shippingType: JTLShippingMethodType;
    trackingUrlSchema: string;
    carrierCode: string;
    carrierName: string;
    cutoffTime: string;
    note: string;
    modificationInfo: ModificationInfo;
}
export interface ModificationInfo {
    createdAt: Date;
    updatedAt: Date;
    state: string;
    changesInRange: ChangesInRange[];
}
export interface ChangesInRange {
}
