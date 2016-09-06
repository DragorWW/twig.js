var is = require('../helper/is');
var max = require('locutus/php/math/max');

module.exports = function (values) {
    if (is("Object", values)) {
        delete values[ "_keys" ];
        return max(values);
    }

    return max.apply(null, arguments);
}
