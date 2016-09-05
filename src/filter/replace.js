var replaceAll = require('../helper/replaceAll');

module.exports = function(value, params) {
  if (value === undefined||value === null){
    return;
  }

  var pairs = params[0],
    tag;
  for (tag in pairs) {
    if (pairs.hasOwnProperty(tag) && tag !== "_keys") {
      value = replaceAll(value, tag, pairs[tag]);
    }
  }
  return value;
}