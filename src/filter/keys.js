module.exports = function(value) {
  if (value === undefined || value === null){
    return;
  }

  var keyset = value._keys || Object.keys(value),
    output = [];

  Twig.forEach(keyset, function(key) {
    if (key === "_keys") return; // Ignore the _keys property
    if (value.hasOwnProperty(key)) {
      output.push(key);
    }
  });
  return output;
}