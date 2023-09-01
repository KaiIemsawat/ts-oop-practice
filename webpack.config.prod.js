// This specific name is required

const path = require("path");
// const CleanPlugin = require("clean-webpack-plugin");

// module.exports = {}; < -- the way to export in Node.JS
module.exports = {
    mode: "production", // <-- saying that this is in prod stage
    entry: "./src/app.ts", // <-- to root entry file
    devServer: {
        static: [
            {
                directory: path.join(__dirname),
            },
        ],
    },
    output: {
        filename: "bundle.js", // <-- could be any other name. Could also be name.[contenthash].js to have webpack autogenerate unique file name
        path: path.resolve(__dirname, "dist"), // need to match with what in "outDir" in tsconfig.json. path tell where the output should be written
        // path: path.resolve(__dirname, "dist") <-- needs absolute path. Thus import 'const path = require("path");'
        clean: true,
    },
    devtool: false, // set to false in prod
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"], // <-- tell webpack to look for '.ts' as well as '.js'
    },
    // webpack 5 doesn't need plugin
    // plugins: [
    //     new CleanPlugin.CleanWebpackPlugin(), // <-- tell webpack to clear dist folder before writing the new ones
    // ],
};
