"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_lambda_1 = require("@aws-sdk/client-lambda");
const main_controller_1 = require("@controllers/main.controller");
const client_1 = require("@prisma/client");
const log_error_1 = require("src/error/log-error");
module.exports.handler = async () => {
    try {
        const jtls = await main_controller_1.prisma.apiConnection.findMany({
            where: {
                api_provider: client_1.ApiProvider.JTL_FULFILLMENT,
                outdated: false,
            },
        });
        console.log("Updating JTL stocks for", jtls.length, "JTL accounts", jtls.map((jtl) => jtl.company_id));
        if (jtls.length) {
            const lambda = new client_lambda_1.LambdaClient({
                region: "eu-west-1",
            });
            await Promise.all(jtls.map(async (jtl) => {
                const params = {
                    FunctionName: "lambda-dev-updateUserJtlStocks",
                    InvocationType: "DryRun",
                    Payload: JSON.stringify({ company_id: jtl.company_id }),
                };
                const command = new client_lambda_1.InvokeCommand(params);
                const test = await lambda.send(command);
                console.log(test.StatusCode);
            }));
        }
        return {
            statusCode: 200,
            message: "Successfully updated all JTL stocks",
        };
    }
    catch (error) {
        log_error_1.rollbar.error(error);
        return Promise.reject(error);
    }
};
//# sourceMappingURL=updateAllUserJtlStocks.js.map