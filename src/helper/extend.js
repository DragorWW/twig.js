module.exports = function (src, add) {
  var keys = Object.keys(add),
    i;

  i = keys.length;

  while (i--) {
    src[keys[i]] = add[keys[i]];
  }

  return src;
}