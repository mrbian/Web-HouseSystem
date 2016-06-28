/**
 * Created by bln on 16-6-28.
 */

var context;
module.exports = {
    get: () => {
        return context;
    },
    set: (ctx) => {
        context = ctx;
    }
};