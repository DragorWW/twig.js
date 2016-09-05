module.exports = function (src, add) {
  if (Object.assign) {
    return Object.assign(src,add);
  } else {
    var keys = Object.keys(add),
      i;

    i = keys.length;

    while (i--) {
      src[keys[i]] = add[keys[i]];
    }

    return src;
  }

}