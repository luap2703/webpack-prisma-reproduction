"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const prisma_nested_middleware_1 = require("prisma-nested-middleware");
const log_error_1 = require("../error/log-error");
const s3_services_1 = require("../services/files/s3.services");
const p = new client_1.PrismaClient();
p.$use((0, prisma_nested_middleware_1.createNestedMiddleware)(async (params, next) => {
    const result = await next(params);
    if (params.model == "File" && result) {
        if (params.action == "delete") {
            if (result.file_id && result.file_type) {
                await (0, s3_services_1.deleteFile)(result.file_id, result.file_type);
            }
        }
        else if (params.action == "deleteMany") {
            throw new Error("Delete many on files is not allowed! - Delete one by one");
        }
    }
    return result;
}));
p.$use((0, prisma_nested_middleware_1.createNestedMiddleware)(async (params, next) => {
    const result = await next(params);
    try {
        if (params.model == "File" &&
            params.action != "delete" &&
            params.action != "deleteMany" &&
            params.action != "createMany" &&
            params.action != "create" &&
            params.action != "updateMany" &&
            params.action != "aggregate" &&
            params.action != "disconnect" &&
            params.action != "connect" &&
            params.action != "count" &&
            result) {
            if (Array.isArray(result)) {
                const response = await Promise.all(result.map(async (file) => {
                    const url = await (0, s3_services_1.getSignedDownloadUrl)(`USER_MEDIA/${file.file_type}/${file.file_id}`);
                    const updatedFile = {
                        ...file,
                        url,
                    };
                    return updatedFile;
                }));
                return response;
            }
            else {
                const url = await (0, s3_services_1.getSignedDownloadUrl)(`USER_MEDIA/${result.file_type}/${result.file_id}`);
                const updatedFile = {
                    ...result,
                    url,
                };
                return updatedFile;
            }
        }
    }
    catch (error) {
        log_error_1.rollbar.info(error);
    }
    return result;
}));
p.$use((0, prisma_nested_middleware_1.createNestedMiddleware)(async (params, next) => {
    const result = await next(params);
    try {
        if (params.model == "File" && params.action == "create" && result) {
            const url = await (0, s3_services_1.getSignedUploadUrl)(result.file_id, result.file_type, 3600);
            const updatedFile = {
                ...result,
                url,
            };
            return updatedFile;
        }
    }
    catch (error) {
        log_error_1.rollbar.error(error);
    }
    return result;
}));
p.$use((0, prisma_nested_middleware_1.createNestedMiddleware)(async (params, next) => {
    const result = await next(params);
    try {
        if (params.model == "UserOnChat" &&
            params.action == "findMany" &&
            !params.scope?.parentParams?.model &&
            result) {
            const response = await p.$transaction(async (tx) => {
                const newArr = result.map(async (userOnChat) => {
                    const count = await tx.message.count({
                        where: {
                            chat_id: userOnChat.chat_id,
                            user_id: {
                                not: userOnChat.user_id,
                            },
                            created_at: {
                                gt: userOnChat.last_seen_at,
                            },
                            parent_id: null,
                        },
                    });
                    const updatedUserOnChat = {
                        ...userOnChat,
                        unread_messages_count: count,
                    };
                    return updatedUserOnChat;
                });
                return await Promise.all(newArr);
            });
            return response;
        }
    }
    catch (error) {
        log_error_1.rollbar.error(error);
    }
    return result;
}));
exports.prisma = p
    .$extends({
    result: {
        user: {
            name: {
                needs: { given_name: true, family_name: true },
                compute(user) {
                    return `${user.given_name} ${user.family_name}`;
                },
            },
        },
    },
})
    .$extends({
    result: {
        amazonProduct: {
            isReady: {
                needs: {
                    unitsShippedT1: true,
                    unitsShippedT3: true,
                    unitsShippedT7: true,
                    unitsShippedT30: true,
                    total_quantity: true,
                    products_per_carton: true,
                    sales_velocity: true,
                },
                compute(amazonProduct) {
                    if (amazonProduct.unitsShippedT1 != null &&
                        amazonProduct.unitsShippedT3 != null &&
                        amazonProduct.unitsShippedT7 != null &&
                        amazonProduct.unitsShippedT30 != null &&
                        amazonProduct.total_quantity != null) {
                        return true;
                    }
                    return false;
                },
            },
        },
    },
});
//# sourceMappingURL=main.controller.js.map