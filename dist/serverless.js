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
        testFunction: {
            handler: "src/functions/testFunction.handler",
            timeout: 240,
            memorySize: 512,
            tracing: true,
        },
    },
    package: {
        individually: true,
        patterns: [
            "node_modules/prisma/**"
        ],
    },
    custom: {
        prisma: {
            installDeps: false,
        },
        webpack: {
            packager: "npm",
            webpackConfig: "./webpack.config.js",
            includeModules: {
                forceExclude: ["aws-sdk"],
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