// chunk an array (arr) into arrays of (size) items, returns an array of arrays, or an empty array on invalid input
module.exports = function (arr, size) {
  var returnVal = [],
    x = 0,
    len = arr.length;

  if (size < 1 || !Twig.lib.is("Array", arr)) {
    return [];
  }

  while (x < len) {
    returnVal.push(arr.slice(x, x += size));
  }

  return returnVal;
}