export interface JtlFulfillersReponse {
    items: JtlFulfiller[];
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
export interface JtlFulfiller {
    userId: string;
    isActive: boolean;
    address: Address;
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
