const express = require("express");
const path = require("path");
const expressStaticGzip = require("express-static-gzip");
const app = express();

if (process.env.NODE_ENV === "dev") {
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const configuration = require("../webpack/webpack.dev.config");
  const webpack = require("webpack");
  const webpackCompiler = webpack(configuration);
  app.use(
    webpackDevMiddleware(webpackCompiler, configuration.devServer.devMiddleware)
  );
  const webpackHotMiddleware = require("webpack-hot-middleware");
  app.use(webpackHotMiddleware(webpackCompiler));
}

app.get("/", (req, res) => {
  const filePath = path.resolve(__dirname, "../dist/index.html");
  res.sendFile(filePath);
});

app.use("/static", expressStaticGzip(path.resolve(__dirname, "../dist")));

app.listen(3000, function () {
  console.log("Application is running on http://localhost:3000/");
});
