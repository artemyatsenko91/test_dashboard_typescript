const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/script.ts",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/style.css",
        }),
        new HtmlWebpackPlugin({
            title: "webpack Boilerplate",
            template: "./index.html",
            filename: "index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "./src/data.json",
                    to: "data.json",
                },
                {
                    from: "./images",
                    to: "images",
                },
            ],
        }),
    ],
};
