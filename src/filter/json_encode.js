var forEach = require('../helper/forEach');
var is = require('../helper/is');

module.exports = json_encode;

function json_encode (value) {
  if(value === undefined || value === null) {
    return "null";
  }
  else if ((typeof value == 'object') && (is("Array", value))) {
    output = [];

    forEach(value, function(v) {
      output.push(json_encode(v));
    });

    return "[" + output.join(",") + "]";
  }
  else if (typeof value == 'object') {
    var keyset = value._keys || Object.keys(value),
      output = [];

    forEach(keyset, function(key) {
      output.push(JSON.stringify(key) + ":" + json_encode(value[key]));
    });

    return "{" + output.join(",") + "}";
  }
  else {
    return JSON.stringify(value);
  }
}

