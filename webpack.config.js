/**
 * Created by bln on 16-6-28.
 */
var path = require('path');
var webpack = require('webpack');
var extend = require('util')._extend;

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var adminEnties = {
    'admin-index': ['./src/js/admin/index.js'],
    'admin-login' : ['./src/js/admin/login.js']
};

var extraEntries = {

};

var entry = extend({}, adminEnties);
// entry = extend(entry, adminEnties);

module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: '[name].js',
        publicPath: '/dist/',
        sourceMapFileName: '[file].map'
    },
    resolve: {
        root: [path.join(__dirname, "/src/bower_components")]
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            },
            { test : /\.(ttf|eot|svg|woff(2)?)(\?[a-z=0-9\.]+)?$/, loader : 'url-loader?limit=8192'},
            { test : /\.(png|gif|svg|jpg)$/, loader : 'url-loader?limit=8192'}
        ]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new ExtractTextPlugin("[name].css"),
        new CommonsChunkPlugin("admin-commons.js", Object.keys(adminEnties))
    ],
    //devtool: 'source-map'
    
};


var WebpackDevServer = require("webpack-dev-server");
var config = require('./webpack.config');
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    stats: { colors: true }
});
server.listen(9000);