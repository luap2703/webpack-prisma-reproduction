import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "lambda",
  frameworkVersion: "3",
  plugins: [
    //"serverless-esbuild",
    "serverless-dotenv-plugin",
    "serverless-webpack",
    "serverless-webpack-prisma",

    //"serverless-offline",
  ],
  provider: {
    name: "aws",
    // eu-west-1
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
  // import the function via paths
  functions: {
    testFunction: {
      handler: "src/functions/testFunction.handler",
      // Receive SQS messages
      timeout: 240,
      memorySize: 512,
      tracing: true,
    },
  },
  package: {
    individually: true,
    patterns: [
      "node_modules/prisma/**"//libquery_engine*"
      /*
      "node_modules/.prisma/client/*",
      ...(process.env.NODE_ENV === "production"
        ? ["!node_modules/.prisma/client/libquery_engine-*"]
        : []),
      "node_modules/.prisma/client/libquery_engine-rhel-*",
      "!node_modules/prisma/libquery_engine-*",
      "!node_modules/@prisma/engines/**",*/
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

    // REQUIRED TO POINT PRISMA AWAY FROM THE WRONG ENGINE
    prismaEngine: {
      offline: "node_modules/.prisma/client/*.node",
      staging: "node_modules/.prisma/client/libquery_engine-rhel*",
      prod: "node_modules/.prisma/client/libquery_engine-rhel*",
    },
  },
};

module.exports = serverlessConfiguration;
