const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "bundle.[contenthash].js",
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: true,
                },
            }),
            new CssMinimizerPlugin(),
        ],
        splitChunks: {
            chunks: "all",
        },
    },
});
