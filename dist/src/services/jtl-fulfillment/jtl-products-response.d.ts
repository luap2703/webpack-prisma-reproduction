export interface JtlProductsResponse {
    items: JtlProductItem[];
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
export interface JtlProductItem {
    jfsku: string;
    name: string;
    merchantSku: string;
    pictures: Picture[];
    productGroup: string;
    originCountry: string;
    manufacturer: string;
    weight: number;
    netWeight: number;
    note: string;
    identifier: Identifier;
    specifications: Specifications;
    dimensions: Dimensions;
    attributes: Attribute[];
    netRetailPrice: NetRetailPrice;
    bundles: Bundle[];
    relatedProducts: RelatedProduct[];
    condition: string;
    modificationInfo: ModificationInfo;
}
export interface Attribute {
    key: string;
    value: string;
    attributeType: string;
}
export interface Bundle {
    name: string;
    quantity: number;
    ean: string;
    upc: string;
}
export interface Dimensions {
    width: number;
    length: number;
    height: number;
}
export interface Identifier {
    mpn: Mpn;
    ean: string;
    isbn: string;
    upc: string;
    asin: string;
}
export interface Mpn {
    manufacturer: string;
    partNumber: string;
}
export interface ModificationInfo {
    createdAt: Date;
    updatedAt: Date;
    state: string;
    changesInRange: ChangesInRange[];
}
export interface ChangesInRange {
}
export interface NetRetailPrice {
    amount: number;
    currency: string;
}
export interface Picture {
    number: number;
    url: string;
    publicUrl: string;
    hash: string;
    size: number;
    mimeType: string;
}
export interface RelatedProduct {
    jfsku: string;
    condition: string;
    kindOfRelation: string;
}
export interface Specifications {
    unNumber: string;
    hazardIdentifier: string;
    taric: string;
    fnsku: string;
    isBatch: boolean;
    isDivisible: boolean;
    isBestBefore: boolean;
    isSerialNumber: boolean;
    isBillOfMaterials: boolean;
    billOfMaterialsComponents: BillOfMaterialsComponent[];
}
export interface BillOfMaterialsComponent {
    jfsku: string;
    quantity: number;
}
