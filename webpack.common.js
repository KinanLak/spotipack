const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { SourceMapDevToolPlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: "./src/entry.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader" },
                    { loader: "postcss-loader" },
                    { loader: "sass-loader" },
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                type: "asset/resource",
            },
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
            {
                test: /\.json$/,
                type: "json",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "index.html",
            favicon: path.resolve(__dirname, "./src/images/favicon.ico"),
        }),
        new Dotenv({
            path: "./.env",
        }),
        new SourceMapDevToolPlugin({
            filename: "[file].map",
            exclude: ["vendor.js", "node_modules/@fortawesome/fontawesome-free/css/all.min.css"],
            append: "\n//# sourceMappingURL=[url]",
            exclude: ["vendor.js"],
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css",
        }),
    ],
    resolve: {
        extensions: [".ts", ".js"],
    },
};
