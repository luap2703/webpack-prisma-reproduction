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
    receiveSpApiMessages: {
      handler: "src/functions/receiveSpApiMessages.handler",
      // Receive SQS messages
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
  },
  package: {
    individually: true,
    /*patterns: [
      "node_modules/.prisma/client/*",
      ...(process.env.NODE_ENV === "production"
        ? ["!node_modules/.prisma/client/libquery_engine-*"]
        : []),
      "node_modules/.prisma/client/libquery_engine-rhel-*",
      "!node_modules/prisma/libquery_engine-*",
      "!node_modules/@prisma/engines/**",
    ],*/
  },
  custom: {
    /*esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      //target: "esnext",
      target: "node18",
      //outputFileExtension: ".mjs",
      //format: "esm",
      //define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 1,
    },*/
    /*

      webpack:
    webpackConfig: ./webpack.config.ts
    includeModules: true
    packager: 'yarn' # Packager that will be used to package your external modules
    */
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
        //@aws-sdk/client-s3
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
