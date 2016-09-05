var forEach = require('./forEach');
module.exports = function(target, source, onlyChanged) {
  forEach(Object.keys(source), function (key) {
    if (onlyChanged && !(key in target)) {
      return;
    }

    target[key] = source[key]
  });

  return target;
}