const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    // clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    // Add the HtmlWebpackPlugin plugin to the plugins array to generate an index.html file in the dist directory. Set the filename option to index.html and the template option to src/index.html. This will generate an index.html file based on the template file in the src directory.
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html",
    }),
    // Add the CleanWebpackPlugin plugin to the plugins array to clean the dist directory before each build. Set the cleanOnceBeforeBuildPatterns option to ['**/*', path.join(process.cwd(), 'extra/**/*')]. This will clean all files and directories in the dist directory and the extra directory in the project root directory before each build.
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "**/*",
        path.join(process.cwd(), "extra/**/*"),
      ],
    }),
    // Add the CopyWebpackPlugin plugin to the plugins array to copy the images directory from the src directory to the dist directory. This will copy the images from the src directory to the dist directory. The images will be available in the dist directory after the build.
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: "images/*.*",
    //     },
    //   ],
    // }),
  ],
};

module.exports = config;
