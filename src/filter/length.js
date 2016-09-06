var is = require('../helper/is');

module.exports = function (value) {
    if (is("Array", value) || typeof value === "string") {
        return value.length;
    } else if (is("Object", value)) {
        if (value._keys === undefined) {
            return Object.keys(value).length;
        } else {
            return value._keys.length;
        }
    } else {
        return 0;
    }
}
