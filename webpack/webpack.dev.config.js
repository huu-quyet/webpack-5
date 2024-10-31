const common = require("./webpack.common.config");
const { merge } = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");

const config = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  output: {
    filename: "[name].[contenthash:12].js",
    publicPath: "/static/",
  },
  devServer: {
    port: 1998,
    static: {
      directory: path.resolve(__dirname, "../dist"),
    },
    devMiddleware: {
      index: "index.html",
      writeToDisk: true,
    },
    client: {
      overlay: true,
    },
    liveReload: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]--[md4:hash:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: "./images/[name].[ext]",
        },
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});

module.exports = config;
