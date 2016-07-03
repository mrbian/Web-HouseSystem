/**
 * Created by bln on 16-6-29.
 */
var ctx;
module.exports = {
    set : (context) => {
        ctx = context;
    },
    get : () => {
        return ctx;
    }
};