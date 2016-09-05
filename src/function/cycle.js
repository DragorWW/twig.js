module.exports = function(arr, i) {
  var pos = i % arr.length;
  return arr[pos];
}