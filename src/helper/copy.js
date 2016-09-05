// shallow-copy an object
module.exports = function(src) {
  var target = {},
    key;
  for (key in src)
    target[key] = src[key];

  return target;
};