var webpack = require("webpack");
var path = require('path');

//var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var plugins = [
    new webpack.ContextReplacementPlugin(
        /.*/,
        path.resolve(__dirname,
            'node_modules',
            'jsondiffpatch'),
        {
            '../package.json': './package.json',
            './formatters': './src/formatters/index.js',
            './console': './src/formatters/console.js'
        }
    ),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    })
    //new BundleAnalyzerPlugin(),
];


module.exports = {
    entry: __dirname + "/public/entry.js",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader?name=font-bundle/[name].[ext]'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: 'url-loader?limit=10000'
            },
        ]
    },
    plugins: plugins
};
