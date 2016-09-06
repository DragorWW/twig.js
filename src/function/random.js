var is = require('../helper/is');

module.exports = function (value) {
    var LIMIT_INT31 = 0x80000000;

    function getRandomNumber (n) {
        var random = Math.floor(Math.random() * LIMIT_INT31);
        var limits = [ 0, n ];
        var min = Math.min.apply(null, limits),
            max = Math.max.apply(null, limits);
        return min + Math.floor((max - min + 1) * random / LIMIT_INT31);
    }

    if (is("Number", value)) {
        return getRandomNumber(value);
    }

    if (is("String", value)) {
        return value.charAt(getRandomNumber(value.length - 1));
    }

    if (is("Array", value)) {
        return value[ getRandomNumber(value.length - 1) ];
    }

    if (is("Object", value)) {
        var keys = Object.keys(value);
        return value[ keys[ getRandomNumber(keys.length - 1) ] ];
    }

    return getRandomNumber(LIMIT_INT31 - 1);
}
