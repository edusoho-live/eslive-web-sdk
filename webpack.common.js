const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: {
        sdk: './src/index.js',
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "example/index.html", to: "example.html" },
            ],
        }),
    ],
    output: {
        filename: 'live-sdk.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        library: {
            name: "LiveSDK",
            type: "var",
            export: "default",
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-transform-runtime"],
                    }
                }
            }
        ]
    }
};
