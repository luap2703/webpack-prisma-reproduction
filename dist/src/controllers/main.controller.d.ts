export declare const prisma: import("@prisma/client/runtime").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime").Args & {
    result: {
        user: {
            name: () => {
                needs: {
                    given_name: true;
                    family_name: true;
                };
                compute(user: {
                    given_name: string | null;
                    family_name: string | null;
                }): string;
            };
        };
        amazonProduct: {
            isReady: () => {
                needs: {
                    unitsShippedT1: true;
                    unitsShippedT3: true;
                    unitsShippedT7: true;
                    unitsShippedT30: true;
                    total_quantity: true;
                    products_per_carton: true;
                    sales_velocity: true;
                };
                compute(amazonProduct: {
                    unitsShippedT1: number | null;
                    unitsShippedT3: number | null;
                    unitsShippedT7: number | null;
                    unitsShippedT30: number | null;
                    total_quantity: number | null;
                    products_per_carton: number | null;
                    sales_velocity: number | null;
                }): boolean;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}>, import(".prisma/client").Prisma.TypeMapCb, {
    result: {
        user: {
            name: () => {
                needs: {
                    given_name: true;
                    family_name: true;
                };
                compute(user: {
                    given_name: string | null;
                    family_name: string | null;
                }): string;
            };
        };
        amazonProduct: {
            isReady: () => {
                needs: {
                    unitsShippedT1: true;
                    unitsShippedT3: true;
                    unitsShippedT7: true;
                    unitsShippedT30: true;
                    total_quantity: true;
                    products_per_carton: true;
                    sales_velocity: true;
                };
                compute(amazonProduct: {
                    unitsShippedT1: number | null;
                    unitsShippedT3: number | null;
                    unitsShippedT7: number | null;
                    unitsShippedT30: number | null;
                    total_quantity: number | null;
                    products_per_carton: number | null;
                    sales_velocity: number | null;
                }): boolean;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}>;
