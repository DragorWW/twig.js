// shallow-copy an object
module.exports = function(src) {
  if (Object.assign) {
    return Object.assign({}, src);
  } else {
    var target = {},
      key;
    for (key in src) {
      target[ key ] = src[ key ];
    }

    return target;
  }

};