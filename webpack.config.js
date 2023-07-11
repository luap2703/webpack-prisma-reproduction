const serverlessWebpack = require("serverless-webpack");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
//const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const path = require("path");
module.exports = {
  devtool: "inline-cheap-module-source-map",
  entry: serverlessWebpack.lib.entries,
  mode: serverlessWebpack.lib.webpack.isLocal ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
      },
    ],
  },
  node: false,
  externals: [
    {
      "aws-sdk": "aws-sdk",
      "@prisma/client": "@prisma/client",
    },
  ],

  resolve: {
    extensions: [".mjs", ".ts", ".js"],
  },
  //plugins: [new ForkTsCheckerWebpackPlugin()],
  target: "node",
};
