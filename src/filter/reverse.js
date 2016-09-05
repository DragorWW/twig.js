module.exports = function(value) {
  if (is("Array", value)) {
    return value.reverse();
  } else if (is("String", value)) {
    return value.split("").reverse().join("");
  } else if (is("Object", value)) {
    var keys = value._keys || Object.keys(value).reverse();
    value._keys = keys;
    return value;
  }
}