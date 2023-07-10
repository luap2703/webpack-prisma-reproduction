export interface JtlWarehousesResponse {
    items: JtlWarehouseItem[];
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
export interface JtlWarehouseItem {
    warehouseId: string;
    fulfillerId: string;
    name: string;
    address: Address;
    shippingMethodIds: string[];
    modificationInfo: ModificationInfo;
}
export interface Address {
    salutation: string;
    firstname: string;
    lastname: string;
    company: string;
    street: string;
    city: string;
    zip: string;
    country: string;
    email: string;
    phone: string;
    extraLine: string;
    extraAddressLine: string;
    state: string;
    mobile: string;
    fax: string;
}
export interface ModificationInfo {
    createdAt: Date;
    updatedAt: Date;
    state: string;
    changesInRange: ChangesInRange[];
}
export interface ChangesInRange {
}
