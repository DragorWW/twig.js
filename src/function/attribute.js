var is = require('../helper/is');

module.exports = function (object, method, params) {
    if (is('Object', object)) {
        if (object.hasOwnProperty(method)) {
            if (typeof object[ method ] === "function") {
                return object[ method ].apply(undefined, params);
            }
            else {
                return object[ method ];
            }
        }
    }
    // Array will return element 0-index
    return object[ method ] || undefined;
}
