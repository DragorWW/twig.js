
/**
 * Fallback for Array.indexOf for IE8 et al
 *
 * @param {Array} arr
 * @param searchElement
 * @returns {Number}
 */
module.exports = function (arr, searchElement /*, fromIndex */ ) {
  if (Array.prototype.hasOwnProperty("indexOf")) {
    return arr.indexOf(searchElement);
  }
  if (arr === void 0 || arr === null) {
    throw new TypeError();
  }
  var t = Object(arr);
  var len = t.length >>> 0;
  if (len === 0) {
    return -1;
  }
  var n = 0;
  if (arguments.length > 0) {
    n = Number(arguments[1]);
    if (n !== n) { // shortcut for verifying if it's NaN
      n = 0;
    } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
      n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
  }
  if (n >= len) {
    return -1;
  }
  var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
  for (; k < len; k++) {
    if (k in t && t[k] === searchElement) {
      return k;
    }
  }
  if (arr == searchElement) {
    return 0;
  }

  return -1;
};