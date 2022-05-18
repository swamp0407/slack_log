const { merge } = require("webpack-merge");
const common = require("./webpack.common");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  output: {
    filename: "./static/[name].[contenthash].js",
    chunkFilename: "[name]-[contenthash].js",
    path: __dirname + "/../",
  },
  mode: "development",
  devtool: "inline-source-map",
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     inject: true,
  //     template: "../template/index.html",
  //   }),
  // ],
});
