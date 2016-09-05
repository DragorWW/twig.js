module.exports = function(value) {
  if (Twig.lib.is('Object', value)) {
    var keys;

    if (value._keys === undefined) {
      keys = Object.keys(value);
    } else {
      keys = value._keys;
    }

    return value[keys[keys.length - 1]];
  }

  // string|array
  return value[value.length - 1];
}