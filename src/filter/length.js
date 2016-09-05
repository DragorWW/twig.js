module.exports = function(value) {
  if (Twig.lib.is("Array", value) || typeof value === "string") {
    return value.length;
  } else if (Twig.lib.is("Object", value)) {
    if (value._keys === undefined) {
      return Object.keys(value).length;
    } else {
      return value._keys.length;
    }
  } else {
    return 0;
  }
}