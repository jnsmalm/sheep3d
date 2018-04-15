const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: process.env.WEBPACK_ENV,
  devServer: {
    contentBase: path.resolve(__dirname, ".")
  },
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: process.env.WEBPACK_ENV === "production" ? 
      "sheep3d.min.js" : "sheep3d.js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/",
    library: "SHEEP3D",
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html"
    }),
    new webpack.NamedModulesPlugin()
  ]
}