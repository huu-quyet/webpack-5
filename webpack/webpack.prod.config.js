const common = require("./webpack.common.config");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");
const glob = require("glob");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const config = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "js/[name].[contenthash:12].js",
    publicPath: "/static/",
  },
  optimization: {
    minimize: true,
    minimizer: [
      `...`, // Keep the existing minimizers
      // Add the CssMinimizerPlugin plugin to the minimizer array to minify the CSS in the dist directory. The plugin should be configured to remove all comments from the CSS files. This will minify the CSS files in the dist directory by removing all comments. This is useful for reducing the size of the CSS files.
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      // Add the ImageMinimizerPlugin plugin to the minimizer array to optimize the images in the dist directory. The plugin should be configured to use the imageminMinify implementation with the following options: mozjpeg with quality 65, pngquant with quality [0.65, 0.9] and speed 4, gifsicle with interlaced true, and svgo with removeViewBox false. This will optimize the images in the dist directory using the specified plugins.
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.imageminMinify,
      //     options: {
      //       plugins: [
      //         ["imagemin-mozjpeg", { quality: 65 }],
      //         ["imagemin-pngquant", { quality: [0.65, 0.9], speed: 4 }],
      //         ["imagemin-gifsicle", { interlaced: true }],
      //         [
      //           "imagemin-svgo",
      //           {
      //             plugins: [
      //               {
      //                 name: "preset-default",
      //                 params: {
      //                   overrides: {
      //                     removeViewBox: false,
      //                   },
      //                 },
      //               },
      //               {
      //                 name: "addAttributesToSVGElement",
      //                 params: {
      //                   attributes: [
      //                     {
      //                       xmlns: "http://www.w3.org/2000/svg",
      //                     },
      //                   ],
      //                 },
      //               },
      //             ],
      //           },
      //         ],
      //       ],
      //       generator: [
      //         {
      //           type: "asset",
      //           preset: "webp-custom-name",
      //           implementation: ImageMinimizerPlugin.imageminGenerate,
      //           options: {
      //             plugins: ["imagemin-webp"],
      //           },
      //         },
      //       ],
      //     },
      //   },
      // }),
    ],
    // Opt 1: Extracting heavy dependencies into separate bundles
    // Add the splitChunks option to the optimization object to split the vendor code into separate files in the dist directory. The cacheGroups option should be configured to split the jQuery and Bootstrap code into separate files. This will split the jQuery and Bootstrap code into separate files in the dist directory, reducing the size of the main JavaScript file.
    // splitChunks: {
    //   cacheGroups: {
    //     jquery: {
    //       test: /[\\/]node_modules[\\/]jquery[\\/]/,
    //       chunks: "initial",
    //       name: "jquery",
    //     },
    //     bootstrap: {
    //       test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
    //       chunks: "initial",
    //       name: "bootstrap",
    //     },
    //   },
    // },

    // Opt 2: Splitting code based on size
    // Add the splitChunks option to the optimization object to split the code into separate files in the dist directory based on the size of the code. The maxSize option should be set to 140000 bytes, and the minSize option should be set to 50000 bytes. The name option should be a function that returns the name of the file based on the module identifier. This will split the code into separate files in the dist directory based on the size of the code.
    // splitChunks: {
    //   chunks: "all",
    //   maxSize: 140000,
    //   minSize: 50000,
    //   name(module, chunks, cacheGroupKey) {
    //     const moduleFileName = module.identifier().split("\\").pop();
    //     return moduleFileName.split(".")[0];
    //   },
    // },

    // Opt 3: Splitting code based on node_modules directory structure
    // Add the splitChunks option to the optimization object to split the code into separate files in the dist directory based on the node_modules directory structure. The cacheGroups option should be configured this will split the code into separate files in the dist directory based on the node_modules directory structure, reducing the size of the main JavaScript file.
    // splitChunks: {
    //   chunks: "all",
    //   maxSize: Infinity,
    //   minSize: 0,
    //   cacheGroups: {
    //     node_modules: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name(module) {
    //         const packageName = module.context.match(
    //           /[\\/]node_modules[\\/](.*?)([\\/]|$)/
    //         )[1];
    //         return packageName;
    //       },
    //     },
    //   },
    // },

    // Opt 4: Splitting code based on node_modules directory structure with runtimeChunk option
    // Add the runtimeChunk option to the optimization object to split the runtime code into a separate file in the dist directory. The runtimeChunk option should be set to single. This will split the runtime code into a separate file in the dist directory, reducing the size of the main JavaScript file.
    // runtimeChunk: "single",
    // splitChunks: {
    //   chunks: "all",
    //   maxSize: Infinity,
    //   minSize: 2000,
    //   cacheGroups: {
    //     jquery: {
    //       test: /[\\/]node_modules[\\/]jquery[\\/]/,
    //       name: "jquery",
    //     },
    //     bootstrap: {
    //       test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
    //       name: "bootstrap",
    //     },
    //     lodash_es: {
    //       test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
    //       name: "lodash-es",
    //     },
    //     node_modules: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "node_modules",
    //     },
    //   },
    // },

    // Lazy loading with code splitting using import() function and webpack magic comments for splitting code into separate files in the dist directory. This will split the code into separate files in the dist directory based on the import() function and webpack magic comments, reducing the size of the main JavaScript file.
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxSize: Infinity,
      minSize: 2000,
      cacheGroups: {
        lodash: {
          test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
          name: "lodash-es",
          priority: 2,
        },
        node_modules: {
          test: /[\\/]node_modules[\\/]/,
          name: "node_modules",
          chunks: "initial",
        },
        async: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "async",
          name(module, chunks) {
            return chunks.map((chunk) => chunk.name).join("-");
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[hash:base64:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
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
          filename: "./images/[name].[contenthash:12][ext]",
        },
        // Add the image-webpack-loader to the rules array to optimize the images in the dist directory.
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 40,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Add the MiniCssExtractPlugin plugin to the plugins array to extract the CSS into a separate file in the dist directory. The filename should be [name].[contenthash:12].css. This will generate a unique filename for the CSS file based on the content of the file. The contenthash ensures that the filename changes when the content of the file changes. This is useful for cache busting.
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:12].css",
    }),
    // Add the PurgeCSSPlugin plugin to the plugins array to remove unused CSS from the CSS files in the dist directory. The plugin should be configured to scan all files in the src directory for CSS classes to keep. This will remove unused CSS classes from the CSS files in the dist directory, reducing the size of the CSS files.
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.resolve(__dirname, "../src")}/**/*`, {
        nodir: true,
      }),
    }),
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.(js|css)$/,
    }),
  ],
});

module.exports = config;
