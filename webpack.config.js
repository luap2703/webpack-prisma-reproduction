const serverlessWebpack = require("serverless-webpack");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

module.exports = {
  devtool: "inline-cheap-module-source-map",
  entry: serverlessWebpack.lib.entries,
  mode: "production",
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
    nodeExternals(),
    { "@aws-sdk/client-ses": "@aws-sdk/client-ses" },
    { "@aws-sdk": "@aws-sdk/*" },
    {
      prisma: {
        commonjs: "prisma",
        commonjs2: "prisma",
        amd: "prisma",
        root: "prisma",
      },
    },
  ],
  /*optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },*/
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        /*configFile: "./path/to/tsconfig.json" */
      }),
    ],
    extensions: [".mjs", ".ts", ".js"],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  target: "node",
};
