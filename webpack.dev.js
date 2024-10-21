const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: "./dist",
        port: 3000,
        open: true,
        hot: true,
    },
    output: {
        filename: "bundle.js",
    },
});
