"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverlessConfiguration = {
    service: "lambda",
    frameworkVersion: "3",
    plugins: [
        "serverless-dotenv-plugin",
        "serverless-webpack",
        "serverless-webpack-prisma",
    ],
    provider: {
        name: "aws",
        region: "eu-west-1",
        runtime: "nodejs18.x",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
        },
        profile: "Serverless_Account",
    },
    functions: {
        receiveSpApiMessages: {
            handler: "src/functions/receiveSpApiMessages.handler",
            events: [
                {
                    sqs: {
                        arn: "arn:aws:sqs:eu-west-1:832483516087:EU-WEST-1-QUEUE",
                        batchSize: 1,
                        enabled: true,
                    },
                },
            ],
            timeout: 240,
            memorySize: 512,
            tracing: true,
        },
        updateAllUserJtlStocks: {
            handler: "src/functions/updateAllUserJtlStocks.handler",
            timeout: 15,
            tracing: true,
            events: [
                {
                    schedule: {
                        rate: ["cron(0/15 * * * ? *)"],
                    },
                },
            ],
        },
        updateUserJtlStocks: {
            handler: "src/functions/updateUserJtlStocks.handler",
            timeout: 12,
            tracing: true,
        },
    },
    package: {
        individually: true,
    },
    custom: {
        webpack: {
            packager: "npm",
            webpackConfig: "./webpack.config.js",
            includeModules: {
                forceExclude: [
                    "aws-sdk",
                    "@aws-sdk/client-lambda",
                    "@aws-sdk/client-s3",
                    "@aws-sdk/s3-request-presigner",
                    "@aws-sdk",
                    "@aws-sdk/**/*",
                ],
            },
        },
        prismaEngine: {
            offline: "node_modules/.prisma/client/*.node",
            staging: "node_modules/.prisma/client/libquery_engine-rhel*",
            prod: "node_modules/.prisma/client/libquery_engine-rhel*",
        },
    },
};
module.exports = serverlessConfiguration;
//# sourceMappingURL=serverless.js.map