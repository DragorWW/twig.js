module.exports = function(value) {
  if(value === undefined || value === null) {
    return "null";
  }
  else if ((typeof value == 'object') && (is("Array", value))) {
    output = [];

    Twig.forEach(value, function(v) {
      output.push(Twig.filters.json_encode(v));
    });

    return "[" + output.join(",") + "]";
  }
  else if (typeof value == 'object') {
    var keyset = value._keys || Object.keys(value),
      output = [];

    Twig.forEach(keyset, function(key) {
      output.push(JSON.stringify(key) + ":" + Twig.filters.json_encode(value[key]));
    });

    return "{" + output.join(",") + "}";
  }
  else {
    return JSON.stringify(value);
  }
}