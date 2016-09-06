var is = require('../helper/is');

module.exports = function (value, params) {
    if (value === undefined || value === null) {
        return;
    }
    if (params === undefined || params.length < 1) {
        throw new Twig.Error("slice filter expects at least 1 argument");
    }

    // default to start of string
    var start = params[ 0 ] || 0;
    // default to length of string
    var length = params.length > 1 ? params[ 1 ] : value.length;
    // handle negative start values
    var startIndex = start >= 0 ? start : Math.max(value.length + start, 0);

    if (is("Array", value)) {
        var output = [];
        for (var i = startIndex; i < startIndex + length && i < value.length; i++) {
            output.push(value[ i ]);
        }
        return output;
    } else if (is("String", value)) {
        return value.substr(startIndex, length);
    } else {
        throw new Twig.Error("slice filter expects value to be an array or string");
    }
}
