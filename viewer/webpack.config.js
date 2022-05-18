const path = require("path");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: {
    main: ["./front/app.js"],
  },
  output: {
    filename: "./[name].[contenthash].js",
    chunkFilename: "[name]-[contenthash].js",
    path: __dirname + "/public/build",
  },
  // mode: "production",
  // mode: "development",
  // devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          // { loader: 'style-loader' },
          { loader: "css-loader" },
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          // { loader: 'style-loader' },
          { loader: "css-loader" },
          { loader: "less-loader" },
        ],
      },
    ],
  },
  optimization: {
    // splitChunks: {
    //   // test: /node_modules/,
    //   // name: 'vendor',
    //   // chunks: 'initial',
    // },
    splitChunks: {
      chunks: "initial",
      name: "vendor",
    },
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: "./[name].[contenthash].css",
    }),
    new CssMinimizerPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: "../template/index.html",
    }),
  ],
};
