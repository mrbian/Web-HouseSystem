/**
 * Created by bln on 16-6-28.
 */
var coViews = require('co-views');

var root = require('./config.js').root;
var viewPath = root + '/views';

var render = coViews(viewPath, {
    map: {
        html: 'ect'
    },
    locals: {
        root: viewPath,
        ext: '.html'
    }
});

module.exports = render;