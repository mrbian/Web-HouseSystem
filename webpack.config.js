/**
 * Created by bln on 16-6-28.
 */
var path = require('path');
var webpack = require('webpack');
var extend = require('util')._extend;

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var adminEntries = {
    'admin-index': ['./src/js/admin/index.js'],
    'admin-first-check' : ['./src/js/admin/first_check.js'],
    'admin-set-material-kind' : ['./src/js/admin/set_material_kind.js'],
    'admin-set-business-kind' : ['./src/js/admin/set_business_kind.js'],
    'admin-set-small-business-kind' : ['./src/js/admin/set_small_business_kind.js'],
    'admin-small-business-detail' : ['./src/js/admin/small_business_detail.js'],
    'admin-base-protect' : ['./src/js/admin/base_protect.js']
};

var userEntries = {
    'user-form': ['./src/js/user/form.js'],
    'user-list' : ['./src/js/user/list.js']
};

var extraEntries = {
    'admin-login' : ['./src/js/admin/login.js']
};

var entry = extend({}, adminEntries);
    entry = extend(entry, userEntries);
    entry = extend(entry,extraEntries);
// entry = extend(entry, adminEntries);

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
            { test : /\.(png|gif|svg|jpg)$/, loader : 'url-loader?limit=8192'},
            { loader: 'exports?window.angular', test: require.resolve('angular') }
        ]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new CommonsChunkPlugin("admin-commons.js", Object.keys(adminEntries)),
        new ExtractTextPlugin("[name].css"),
    ],
    //devtool: 'source-map'
    
};


// var WebpackDevServer = require("webpack-dev-server");
// var config = require('./webpack.config');
// var compiler = webpack(config);
// var server = new WebpackDevServer(compiler, {
//     stats: { colors: true }
// });
// server.listen(9000);