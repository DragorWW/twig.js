module.exports = function(value, params) {
  if (value === undefined||value === null){
    return;
  }

  var pairs = params[0],
    tag;
  for (tag in pairs) {
    if (pairs.hasOwnProperty(tag) && tag !== "_keys") {
      value = Twig.lib.replaceAll(value, tag, pairs[tag]);
    }
  }
  return value;
}