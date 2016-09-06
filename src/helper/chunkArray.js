var is = require('../helper/is');
//
/**
 * chunk an array (arr) into arrays of (size) items, returns an array of arrays, or an empty array on invalid input
 * @param {Array} arr
 * @param {Number} size
 * @returns {Array}
 */
module.exports = function (arr, size) {
    var returnVal = [],
        x = 0,
        len = arr.length;

    if (size < 1 || !is("Array", arr)) {
        return [];
    }

    while (x < len) {
        returnVal.push(arr.slice(x, x += size));
    }

    return returnVal;
};
